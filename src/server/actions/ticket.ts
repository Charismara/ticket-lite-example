"use server";

import { eq, inArray } from "drizzle-orm";
import { db } from "~/server/db";
import { ticket } from "~/server/db/schema";

export const getTickets = async () => {
	return db.query.ticket.findMany({
		orderBy: {
			createdAt: "desc",
		},
	});
};

export const getTicketsByTeamIds = async (teamIds: number[]) => {
	if (teamIds.length === 0) {
		return [];
	}

	return db
		.select()
		.from(ticket)
		.where(inArray(ticket.responsibleTeamId, teamIds))
		.orderBy(ticket.createdAt);
};

export const getTicketById = async (id: number) => {
	const result = await db
		.select()
		.from(ticket)
		.where(eq(ticket.id, id))
		.limit(1);

	return result[0] ?? null;
};

export type CreateTicketInput = typeof ticket.$inferInsert;

export const createTicket = async (input: CreateTicketInput) => {
	const result = await db
		.insert(ticket)
		.values({
			title: input.title,
			description: input.description,
			status: input.status,
			assignedUserId: input.assignedUserId,
			responsibleTeamId: input.responsibleTeamId,
		})
		.returning();

	return result[0];
};

export type UpdateTicketInput = Partial<Omit<CreateTicketInput, "id">>;

export const updateTicket = async (id: number, input: UpdateTicketInput) => {
	const result = await db
		.update(ticket)
		.set(input)
		.where(eq(ticket.id, id))
		.returning();

	return result[0];
};

export const deleteTicket = async (id: number) => {
	await db.delete(ticket).where(eq(ticket.id, id));
};
