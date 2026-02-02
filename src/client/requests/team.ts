"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ms from "ms";
import {
	type CreateTeamInput,
	getTeams,
	getTeamsWithTicketStats,
} from "~/server/actions/team";

export const useTeamsQuery = () =>
	useQuery({
		queryKey: ["teams"],
		queryFn: getTeams,
		refetchInterval: ms("5m"),
		staleTime: ms("10s"),
	});

export const useTeamsWithTicketStatsQuery = () =>
	useQuery({
		queryKey: ["teams", "withStats"],
		queryFn: getTeamsWithTicketStats,
		refetchInterval: ms("5m"),
		staleTime: ms("10s"),
	});

export const useTeamWithMembersQuery = (teamId: number | null) =>
	useQuery({
		queryKey: ["teams", teamId, "members"],
		queryFn: async () => {
			if (!teamId) return null;
			const response = await fetch(`/api/teams/${teamId}`);
			return response.json();
		},
		enabled: teamId !== null,
		staleTime: ms("10s"),
	});

export const useCreateTeamMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["teams", "create"],
		mutationFn: async (input: CreateTeamInput) => {
			const response = await fetch("/api/teams", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});
};

export const useDeleteTeamMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["teams", "delete"],
		mutationFn: async (id: number) => {
			const response = await fetch(`/api/teams/${id}`, {
				method: "DELETE",
			});
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["teams"] });
		},
	});
};

export const useAddUserToTeamMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["teams", "members", "add"],
		mutationFn: async ({
			teamId,
			userId,
		}: {
			teamId: number;
			userId: number;
		}) => {
			const response = await fetch(`/api/teams/${teamId}/members`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId }),
			});
			return response.json();
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["teams"] });
			queryClient.invalidateQueries({
				queryKey: ["teams", variables.teamId, "members"],
			});
		},
	});
};

export const useRemoveUserFromTeamMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["teams", "members", "remove"],
		mutationFn: async ({
			teamId,
			userId,
		}: {
			teamId: number;
			userId: number;
		}) => {
			const response = await fetch(`/api/teams/${teamId}/members`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId }),
			});
			return response.json();
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["teams"] });
			queryClient.invalidateQueries({
				queryKey: ["teams", variables.teamId, "members"],
			});
		},
	});
};
