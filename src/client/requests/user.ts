"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ms from "ms";
import {
	type CreateUserInput,
	getUsers,
	getUserWithTeams,
} from "~/server/actions/user";

export const useUsersQuery = () =>
	useQuery({
		queryKey: ["users"],
		queryFn: getUsers,
		refetchInterval: ms("5m"),
		staleTime: ms("10s"),
	});

export const useUserWithTeamsQuery = (userId: number | null) =>
	useQuery({
		queryKey: ["users", userId, "teams"],
		queryFn: () => (userId ? getUserWithTeams(userId) : null),
		refetchInterval: ms("5m"),
		staleTime: ms("10s"),
		enabled: userId !== null,
	});

export const useCreateUserMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["users", "create"],
		mutationFn: async (input: CreateUserInput) => {
			const response = await fetch("/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
};

export const useDeleteUserMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["users", "delete"],
		mutationFn: async (id: number) => {
			const response = await fetch(`/api/users/${id}`, {
				method: "DELETE",
			});
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
};
