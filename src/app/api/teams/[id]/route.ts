import { type NextRequest, NextResponse } from "next/server";
import { deleteTeam, getTeamWithMembers } from "~/server/actions/team";

export async function GET(
	_request: NextRequest,
	{ params }: RouteContext<"/api/teams/[id]">,
) {
	const { id } = await params;

	const team = await getTeamWithMembers(Number(id));

	if (!team) {
		return NextResponse.json({ error: "Team not found" }, { status: 404 });
	}

	return NextResponse.json(team);
}

export async function DELETE(
	_request: NextRequest,
	{ params }: RouteContext<"/api/teams/[id]">,
) {
	const { id } = await params;

	await deleteTeam(Number(id));

	return NextResponse.json({}, { status: 200 });
}
