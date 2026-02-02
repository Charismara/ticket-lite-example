"use client";

import { useTicketsQuery } from "~/client/requests/ticket";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { dayjs } from "~/utils/dayjs";

export function TicketsCreatedThisWeekTitle() {
	const ticketsQuery = useTicketsQuery();

	const startOfWeek = dayjs().startOf("week");
	const endOfWeek = dayjs().endOf("week");

	const ticketsCreatedThisWeek = ticketsQuery.data?.filter((ticket) => {
		return dayjs(ticket.createdAt).isBetween(startOfWeek, endOfWeek);
	}).length;

	if (ticketsQuery.isLoading) {
		return <LoadingSpinner />;
	}

	return <>{ticketsCreatedThisWeek}</>;
}
