// noinspection JSUnusedGlobalSymbols

import { sql } from "drizzle-orm";
import { sqliteTableCreator } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator(
	(name) => `ticket_lite_example_${name}`,
);

export const user = createTable("user", (d) => ({
	id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	name: d.text({ length: 256 }).notNull(),
	internal: d.integer({ mode: "boolean" }).default(true).notNull(),
}));

export const team = createTable("team", (d) => ({
	id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	name: d.text({ length: 256 }).notNull(),
}));

export const userToTeam = createTable("user_to_team", (d) => ({
	userId: d
		.integer("user_id")
		.notNull()
		.references(() => user.id),
	teamId: d
		.integer("team_id")
		.notNull()
		.references(() => team.id),
}));

type TicketStatus = "offen" | "in bearbeitung" | "abgeschlossen";

export const ticket = createTable("ticket", (d) => ({
	id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	title: d.text({ length: 512 }).notNull(),
	description: d.text().notNull(),
	createdAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
	status: d
		.text({ length: 32 })
		.$type<TicketStatus>()
		.default("offen")
		.notNull(),
	assignedUserId: d.integer("assigned_user_id").references(() => user.id),
	responsibleTeamId: d
		.integer("responsible_team_id")
		.notNull()
		.references(() => team.id),
}));

export const comment = createTable("comment", (d) => ({
	id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
	ticketId: d
		.integer("task_id")
		.notNull()
		.references(() => ticket.id, { onDelete: "cascade" }),
	userId: d
		.integer("user_id")
		.notNull()
		.references(() => user.id),
	internalOnly: d.integer({ mode: "boolean" }).default(false).notNull(),
	comment: d.text().notNull(),
	createdAt: d
		.integer({ mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
}));
