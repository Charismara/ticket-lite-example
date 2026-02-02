import { type NextRequest, NextResponse } from "next/server";
import {
	type CreateCommentInput,
	createComment,
	getCommentsByTicketId,
} from "~/server/actions/comment";

export async function GET(
	_request: NextRequest,
	{ params }: RouteContext<"/api/tickets/[id]/comments">,
) {
	const { id } = await params;

	const comments = await getCommentsByTicketId(Number(id));

	return NextResponse.json(comments);
}

export async function POST(
	request: NextRequest,
	{ params }: RouteContext<"/api/tickets/[id]/comments">,
) {
	const { id } = await params;
	const body = (await request.json()) as Omit<CreateCommentInput, "ticketId">;

	const newComment = await createComment({
		...body,
		ticketId: Number(id),
	});

	return NextResponse.json(newComment, { status: 201 });
}
