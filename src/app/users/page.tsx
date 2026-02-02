"use client";

import { useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useUsersQuery } from "~/client/requests/user";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { CreateUserDialog } from "~/components/users/CreateUserDialog";
import { DeleteUserDialog } from "~/components/users/DeleteUserDialog";

export default function UsersPage() {
	const usersQuery = useUsersQuery();
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [deleteUser, setDeleteUser] = useState<{
		id: number;
		name: string;
	} | null>(null);

	if (usersQuery.isLoading) {
		return (
			<Container className="py-4 text-center">
				<LoadingSpinner />
			</Container>
		);
	}

	return (
		<Container className="py-4">
			<div className="d-flex justify-content-between mb-4 align-items-center">
				<h1 className="mb-0">Benutzer</h1>
				<Button onClick={() => setShowCreateDialog(true)} variant="primary">
					Neuer Benutzer
				</Button>
			</div>
			<Table bordered hover striped>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Intern</th>
						<th>Aktionen</th>
					</tr>
				</thead>
				<tbody>
					{usersQuery.data?.map((user) => (
						<tr key={user.id}>
							<td>{user.id}</td>
							<td>{user.name}</td>
							<td>{user.internal ? "Ja" : "Nein"}</td>
							<td>
								<Button
									onClick={() =>
										setDeleteUser({ id: user.id, name: user.name })
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
			<CreateUserDialog
				onHide={() => setShowCreateDialog(false)}
				show={showCreateDialog}
			/>
			<DeleteUserDialog
				onHide={() => setDeleteUser(null)}
				show={deleteUser !== null}
				userId={deleteUser?.id ?? 0}
				userName={deleteUser?.name ?? ""}
			/>
		</Container>
	);
}
