"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ms from "ms";
import {
	type CreateTicketInput,
	getTicketById,
	getTickets,
	getTicketsByTeamIds,
	type UpdateTicketInput,
} from "~/server/actions/ticket";

export const useTicketsQuery = () =>
	useQuery({
		queryKey: ["tickets"],
		queryFn: getTickets,
		refetchInterval: ms("5m"),
		staleTime: ms("10s"),
	});

export const useTicketsByTeamIdsQuery = (teamIds: number[]) =>
	useQuery({
		queryKey: ["tickets", "byTeams", teamIds],
		queryFn: () => getTicketsByTeamIds(teamIds),
		refetchInterval: ms("5m"),
		staleTime: ms("10s"),
		enabled: teamIds.length > 0,
	});

export const useTicketQuery = (id: number) =>
	useQuery({
		queryKey: ["tickets", id],
		queryFn: () => getTicketById(id),
		refetchInterval: ms("5m"),
		staleTime: ms("10s"),
		enabled: id > 0,
	});

export const useCreateTicketMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["tickets", "create"],
		mutationFn: async (input: CreateTicketInput) => {
			const response = await fetch("/api/tickets", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tickets"] });
		},
	});
};

export const useUpdateTicketMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["tickets", "update"],
		mutationFn: async ({
			id,
			input,
		}: {
			id: number;
			input: UpdateTicketInput;
		}) => {
			const response = await fetch(`/api/tickets/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tickets"] });
		},
	});
};

export const useDeleteTicketMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["tickets", "delete"],
		mutationFn: async (id: number) => {
			const response = await fetch(`/api/tickets/${id}`, {
				method: "DELETE",
			});
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tickets"] });
		},
	});
};
