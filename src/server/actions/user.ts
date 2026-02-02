"use server";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { team, user, userToTeam } from "~/server/db/schema";

export const getUsers = async () => {
	return db.query.user.findMany({
		orderBy: {
			name: "asc",
		},
	});
};

export const getUserWithTeams = async (userId: number) => {
	const userResult = await db
		.select()
		.from(user)
		.where(eq(user.id, userId))
		.limit(1);

	if (!userResult[0]) {
		return null;
	}

	const userTeams = await db
		.select({
			id: team.id,
			name: team.name,
		})
		.from(userToTeam)
		.innerJoin(team, eq(userToTeam.teamId, team.id))
		.where(eq(userToTeam.userId, userId));

	return {
		...userResult[0],
		teams: userTeams,
	};
};

export type CreateUserInput = typeof user.$inferInsert;

export const createUser = async (input: CreateUserInput) => {
	const result = await db
		.insert(user)
		.values({
			name: input.name,
			internal: input.internal,
		})
		.returning();

	return result[0];
};

export const deleteUser = async (id: number) => {
	await db.delete(user).where(eq(user.id, id));
};
