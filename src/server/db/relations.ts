import { defineRelations } from "drizzle-orm";
import * as schema from "~/server/db/schema";

export const relations = defineRelations(schema, (r) => ({
	ticket: {
		users: r.one.user({
			from: r.ticket.assignedUserId,
			to: r.user.id,
		}),
		comments: r.many.comment(),
		responsibleTeam: r.one.team({
			from: r.ticket.responsibleTeamId,
			to: r.team.id,
		}),
	},
	user: {
		tasks: r.many.ticket(),
		teams: r.many.team({
			from: r.user.id.through(r.userToTeam.userId),
			to: r.team.id.through(r.userToTeam.teamId),
		}),
		comments: r.many.comment(),
	},
	comment: {
		tasks: r.one.ticket({
			from: r.comment.ticketId,
			to: r.ticket.id,
		}),
		author: r.one.user({
			from: r.comment.userId,
			to: r.user.id,
		}),
	},
	team: {
		members: r.many.user({
			from: r.team.id.through(r.userToTeam.teamId),
			to: r.user.id.through(r.userToTeam.userId),
		}),
		tickets: r.many.ticket({
			from: r.team.id,
			to: r.ticket.responsibleTeamId,
		}),
	},
}));
