import { type NextRequest, NextResponse } from "next/server";
import {
	type CreateCommentInput,
	createComment,
	getCommentsByTicketId,
} from "~/server/actions/comment";
import { commentEvents } from "~/server/events/commentEvents";

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

	if (newComment) {
		commentEvents.emitNewComment({
			ticketId: Number(id),
			commentId: newComment.id,
		});
	}

	return NextResponse.json(newComment, { status: 201 });
}
