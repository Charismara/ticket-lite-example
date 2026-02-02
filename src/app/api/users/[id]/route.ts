import { type NextRequest, NextResponse } from "next/server";
import { deleteUser, getUserWithTeams } from "~/server/actions/user";

export async function GET(
	_request: NextRequest,
	{ params }: RouteContext<"/api/users/[id]">,
) {
	const { id } = await params;

	const user = await getUserWithTeams(Number(id));

	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	return NextResponse.json(user);
}

export async function DELETE(
	_request: NextRequest,
	{ params }: RouteContext<"/api/users/[id]">,
) {
	const { id } = await params;

	await deleteUser(Number(id));

	return NextResponse.json({}, { status: 200 });
}
