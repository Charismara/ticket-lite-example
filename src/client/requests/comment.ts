"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ms from "ms";
import { useEffect } from "react";
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

export const useCommentsSSE = (ticketId: number) => {
	const queryClient = useQueryClient();

	useEffect(() => {
		if (ticketId <= 0) return;

		const eventSource = new EventSource(
			`/api/tickets/${ticketId}/comments/stream`,
		);

		eventSource.onmessage = () => {
			queryClient.invalidateQueries({
				queryKey: ["tickets", ticketId, "comments"],
			});
		};

		eventSource.onerror = () => {
			// Bei Fehler schließen - Fallback auf Polling bleibt aktiv
			eventSource.close();
		};

		return () => {
			eventSource.close();
		};
	}, [ticketId, queryClient]);
};

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
