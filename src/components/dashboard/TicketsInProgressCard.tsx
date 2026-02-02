"use client";

import { useTicketsQuery } from "~/client/requests/ticket";
import { LoadingSpinner } from "~/components/LoadingSpinner";

export function TicketsInProgressTitle() {
	const ticketsQuery = useTicketsQuery();

	const ticketsInProgress = ticketsQuery.data?.filter(
		(ticket) => ticket.status === "in bearbeitung",
	).length;

	if (ticketsQuery.isLoading) {
		return <LoadingSpinner />;
	}

	return <>{ticketsInProgress}</>;
}
