import { type NextRequest, NextResponse } from "next/server";
import {
	type CreateTicketInput,
	createTicket,
	getTickets,
	getTicketsByTeamIds,
} from "~/server/actions/ticket";

export const GET = async (request: NextRequest) => {
	const { searchParams } = new URL(request.url);
	const teamIdsParam = searchParams.get("teamIds");

	if (teamIdsParam) {
		const teamIds = teamIdsParam.split(",").map(Number).filter(Boolean);
		return NextResponse.json(await getTicketsByTeamIds(teamIds));
	}

	return NextResponse.json(await getTickets());
};

export async function POST(request: NextRequest) {
	const body = (await request.json()) as CreateTicketInput;

	const newTicket = await createTicket(body);

	return NextResponse.json(newTicket, { status: 201 });
}
