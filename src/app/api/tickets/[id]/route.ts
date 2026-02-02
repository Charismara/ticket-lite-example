import { type NextRequest, NextResponse } from "next/server";
import {
	deleteTicket,
	getTicketById,
	type UpdateTicketInput,
	updateTicket,
} from "~/server/actions/ticket";

export async function GET(
	_request: NextRequest,
	{ params }: RouteContext<"/api/tickets/[id]">,
) {
	const { id } = await params;

	const ticket = await getTicketById(Number(id));

	if (!ticket) {
		return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
	}

	return NextResponse.json(ticket);
}

export async function PUT(
	request: NextRequest,
	{ params }: RouteContext<"/api/tickets/[id]">,
) {
	const { id } = await params;
	const body = (await request.json()) as UpdateTicketInput;

	const updatedTicket = await updateTicket(Number(id), body);

	if (!updatedTicket) {
		return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
	}

	return NextResponse.json(updatedTicket);
}

export async function DELETE(
	_request: NextRequest,
	{ params }: RouteContext<"/api/tickets/[id]">,
) {
	const { id } = await params;

	await deleteTicket(Number(id));

	return NextResponse.json({}, { status: 200 });
}
