"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ms from "ms";
import {
	type CreateCommentInput,
	getCommentsByTicketId,
} from "~/server/actions/comment";

export const useCommentsQuery = (ticketId: number) =>
	useQuery({
		queryKey: ["tickets", ticketId, "comments"],
		queryFn: () => getCommentsByTicketId(ticketId),
		refetchInterval: ms("5m"),
		staleTime: ms("10s"),
		enabled: ticketId > 0,
	});

export const useCreateCommentMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["comments", "create"],
		mutationFn: async ({
			ticketId,
			input,
		}: {
			ticketId: number;
			input: Omit<CreateCommentInput, "ticketId">;
		}) => {
			const response = await fetch(`/api/tickets/${ticketId}/comments`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});
			return response.json();
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["tickets", variables.ticketId, "comments"],
			});
		},
	});
};
