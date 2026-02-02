import { NextResponse } from "next/server";
import { getTeamsWithTicketStats } from "~/server/actions/team";

export const GET = async () => {
	return NextResponse.json(await getTeamsWithTicketStats());
};
