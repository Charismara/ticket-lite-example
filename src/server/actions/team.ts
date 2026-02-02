"use server";

import { and, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { team, userToTeam } from "~/server/db/schema";

export const getTeams = async () => {
	return db.query.team.findMany({
		orderBy: {
			name: "asc",
		},
		with: {
			members: true,
		},
	});
};

export const getTeamsWithTicketStats = async () => {
	const teams = await db.query.team.findMany({
		orderBy: {
			name: "asc",
		},
		with: {
			members: true,
			tickets: true,
		},
	});

	return teams.map((t) => ({
		...t,
		openTicketsCount: t.tickets.filter(
			(ticket) => ticket.status !== "abgeschlossen",
		).length,
		closedTicketsCount: t.tickets.filter(
			(ticket) => ticket.status === "abgeschlossen",
		).length,
	}));
};

export const getTeamWithMembers = async (id: number) => {
	return db.query.team.findFirst({
		where: {
			id: id,
		},
		with: {
			members: true,
		},
	});
};

export type CreateTeamInput = typeof team.$inferInsert;

export const createTeam = async (input: CreateTeamInput) => {
	const result = await db
		.insert(team)
		.values({
			name: input.name,
		})
		.returning();

	return result[0];
};

export const deleteTeam = async (id: number) => {
	// Cascade delete: First remove all user-team associations
	await db.delete(userToTeam).where(eq(userToTeam.teamId, id));
	// Then delete the team
	await db.delete(team).where(eq(team.id, id));
};

export type AddUserToTeamInput = typeof userToTeam.$inferInsert;

export const addUserToTeam = async (input: AddUserToTeamInput) => {
	const result = await db
		.insert(userToTeam)
		.values({
			userId: input.userId,
			teamId: input.teamId,
		})
		.returning();

	return result[0];
};

export const removeUserFromTeam = async (teamId: number, userId: number) => {
	await db
		.delete(userToTeam)
		.where(and(eq(userToTeam.teamId, teamId), eq(userToTeam.userId, userId)));
};
