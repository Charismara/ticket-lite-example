"use client";

import { useTicketsQuery } from "~/client/requests/ticket";
import { LoadingSpinner } from "~/components/LoadingSpinner";

export function OpenTicketsTitle() {
	const ticketsQuery = useTicketsQuery();

	const openTickets = ticketsQuery.data?.filter(
		(ticket) => ticket.status !== "abgeschlossen",
	)?.length;
	const totalTickets = ticketsQuery.data?.length;

	if (ticketsQuery.isLoading) {
		return <LoadingSpinner />;
	}

	return <>{`${openTickets} / ${totalTickets}`}</>;
}
