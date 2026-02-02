import { EventEmitter } from "events";

type CommentEventData = {
	ticketId: number;
	commentId: number;
};

class CommentEventEmitter extends EventEmitter {
	emitNewComment(data: CommentEventData) {
		this.emit(`comment:${data.ticketId}`, data);
	}

	onNewComment(ticketId: number, callback: (data: CommentEventData) => void) {
		this.on(`comment:${ticketId}`, callback);
		return () => this.off(`comment:${ticketId}`, callback);
	}
}

// Globale Instanz um Hot-Module-Replacement in Next.js zu überleben
const globalForEvents = globalThis as unknown as {
	commentEvents: CommentEventEmitter | undefined;
};

export const commentEvents =
	globalForEvents.commentEvents ?? new CommentEventEmitter();

if (process.env.NODE_ENV !== "production") {
	globalForEvents.commentEvents = commentEvents;
}
