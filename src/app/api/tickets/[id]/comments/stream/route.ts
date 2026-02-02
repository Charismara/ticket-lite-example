import { commentEvents } from "~/server/events/commentEvents";

export async function GET(
	_request: Request,
	{ params }: RouteContext<"/api/tickets/[id]/comments/stream">,
) {
	const { id } = await params;
	const ticketId = Number(id);

	const encoder = new TextEncoder();

	const stream = new ReadableStream({
		start(controller) {
			const unsubscribe = commentEvents.onNewComment(ticketId, (data) => {
				const message = `data: ${JSON.stringify(data)}\n\n`;
				controller.enqueue(encoder.encode(message));
			});

			// Heartbeat alle 30 Sekunden um die Verbindung offen zu halten
			const heartbeat = setInterval(() => {
				controller.enqueue(encoder.encode(": heartbeat\n\n"));
			}, 30000);

			// Cleanup bei Abbruch
			_request.signal.addEventListener("abort", () => {
				unsubscribe();
				clearInterval(heartbeat);
				controller.close();
			});
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
}
