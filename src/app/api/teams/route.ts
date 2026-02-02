import { type NextRequest, NextResponse } from "next/server";
import {
	type CreateTeamInput,
	createTeam,
	getTeams,
} from "~/server/actions/team";

export async function POST(request: NextRequest) {
	const body = (await request.json()) as CreateTeamInput;

	const newTeam = await createTeam(body);

	return NextResponse.json(newTeam, { status: 201 });
}

export const GET = async () => {
	return NextResponse.json(await getTeams());
};
