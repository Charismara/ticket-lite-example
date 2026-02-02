"use client";

import { useTicketsQuery } from "~/client/requests/ticket";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { dayjs } from "~/utils/dayjs";

export function TicketsClosedThisWeekTitle() {
	const ticketsQuery = useTicketsQuery();

	const startOfWeek = dayjs().startOf("week");
	const endOfWeek = dayjs().endOf("week");

	const ticketsClosedThisWeek = ticketsQuery.data?.filter((ticket) => {
		return (
			ticket.status === "abgeschlossen" &&
			dayjs(ticket.updatedAt).isBetween(startOfWeek, endOfWeek)
		);
	}).length;

	if (ticketsQuery.isLoading) {
		return <LoadingSpinner />;
	}

	return <>{ticketsClosedThisWeek}</>;
}
