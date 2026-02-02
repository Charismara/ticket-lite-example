"use server";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { comment } from "~/server/db/schema";

export const getCommentsByTicketId = async (ticketId: number) => {
	return db
		.select()
		.from(comment)
		.where(eq(comment.ticketId, ticketId))
		.orderBy(comment.createdAt);
};

export type CreateCommentInput = typeof comment.$inferInsert;

export const createComment = async (input: CreateCommentInput) => {
	const result = await db
		.insert(comment)
		.values({
			ticketId: input.ticketId,
			userId: input.userId,
			comment: input.comment,
			internalOnly: input.internalOnly,
		})
		.returning();

	return result[0];
};
