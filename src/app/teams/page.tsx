"use client";

import { useState } from "react";
import { Badge, Button, Container, Table } from "react-bootstrap";
import { useTeamsWithTicketStatsQuery } from "~/client/requests/team";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { CreateTeamDialog } from "~/components/teams/CreateTeamDialog";
import { DeleteTeamDialog } from "~/components/teams/DeleteTeamDialog";
import { ManageTeamMembersDialog } from "~/components/teams/ManageTeamMembersDialog";

export default function TeamsPage() {
	const teamsQuery = useTeamsWithTicketStatsQuery();
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [deleteTeam, setDeleteTeam] = useState<{
		id: number;
		name: string;
	} | null>(null);
	const [manageTeam, setManageTeam] = useState<{
		id: number;
		name: string;
	} | null>(null);

	if (teamsQuery.isLoading) {
		return (
			<Container className="py-4 text-center">
				<LoadingSpinner />
			</Container>
		);
	}

	return (
		<Container className="py-4">
			<div className="d-flex justify-content-between mb-4 align-items-center">
				<h1 className="mb-0">Teams</h1>
				<Button onClick={() => setShowCreateDialog(true)} variant="primary">
					Neues Team
				</Button>
			</div>
			<Table bordered hover striped>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Mitglieder</th>
						<th>Offene Tickets</th>
						<th>Geschlossene Tickets</th>
						<th>Aktionen</th>
					</tr>
				</thead>
				<tbody>
					{teamsQuery.data?.map((team) => (
						<tr key={team.id}>
							<td>{team.id}</td>
							<td>{team.name}</td>
							<td>{team.members?.length ?? 0}</td>
							<td>
								<Badge bg="warning" text="dark">
									{team.openTicketsCount}
								</Badge>
							</td>
							<td>
								<Badge bg="success">{team.closedTicketsCount}</Badge>
							</td>
							<td>
								<Button
									className="me-2"
									onClick={() =>
										setManageTeam({ id: team.id, name: team.name })
									}
									size="sm"
									variant="outline-primary"
								>
									Mitglieder
								</Button>
								<Button
									onClick={() =>
										setDeleteTeam({ id: team.id, name: team.name })
									}
									size="sm"
									variant="danger"
								>
									Löschen
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
			<CreateTeamDialog
				onHide={() => setShowCreateDialog(false)}
				show={showCreateDialog}
			/>
			<DeleteTeamDialog
				onHide={() => setDeleteTeam(null)}
				show={deleteTeam !== null}
				teamId={deleteTeam?.id ?? 0}
				teamName={deleteTeam?.name ?? ""}
			/>
			<ManageTeamMembersDialog
				onHide={() => setManageTeam(null)}
				show={manageTeam !== null}
				teamId={manageTeam?.id ?? 0}
				teamName={manageTeam?.name ?? ""}
			/>
		</Container>
	);
}
