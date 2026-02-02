import { type NextRequest, NextResponse } from "next/server";
import { addUserToTeam, removeUserFromTeam } from "~/server/actions/team";

export async function POST(
	request: NextRequest,
	{ params }: RouteContext<"/api/teams/[id]/members">,
) {
	const { id } = await params;
	const body = (await request.json()) as { userId: number };

	const result = await addUserToTeam({
		teamId: Number(id),
		userId: body.userId,
	});

	return NextResponse.json(result, { status: 201 });
}

export async function DELETE(
	request: NextRequest,
	{ params }: RouteContext<"/api/teams/[id]/members">,
) {
	const { id } = await params;
	const body = (await request.json()) as { userId: number };

	await removeUserFromTeam(Number(id), body.userId);

	return NextResponse.json({}, { status: 200 });
}
