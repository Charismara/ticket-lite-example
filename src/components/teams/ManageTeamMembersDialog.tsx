"use client";

import { useMemo, useState } from "react";
import {
	Button,
	Form,
	FormSelect,
	ListGroup,
	ListGroupItem,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	Spinner,
} from "react-bootstrap";
import {
	useAddUserToTeamMutation,
	useRemoveUserFromTeamMutation,
	useTeamWithMembersQuery,
} from "~/client/requests/team";
import { useUsersQuery } from "~/client/requests/user";

type ManageTeamMembersDialogProps = {
	show: boolean;
	onHide(): void;
	teamId: number;
	teamName: string;
};

export function ManageTeamMembersDialog({
	show,
	onHide,
	teamId,
	teamName,
}: ManageTeamMembersDialogProps) {
	const [selectedUserId, setSelectedUserId] = useState<string>("");
	const usersQuery = useUsersQuery();
	const teamQuery = useTeamWithMembersQuery(show ? teamId : null);
	const addUserMutation = useAddUserToTeamMutation();
	const removeUserMutation = useRemoveUserFromTeamMutation();

	const memberIds = useMemo(() => {
		if (!teamQuery.data?.members) return new Set<number>();
		return new Set(teamQuery.data.members.map((m: { id: number }) => m.id));
	}, [teamQuery.data?.members]);

	const members = useMemo(() => {
		if (!teamQuery.data?.members) return [];
		return teamQuery.data.members as {
			id: number;
			name: string;
			internal: boolean;
		}[];
	}, [teamQuery.data?.members]);

	const availableUsers = useMemo(() => {
		if (!usersQuery.data) return [];
		return usersQuery.data.filter((user) => !memberIds.has(user.id));
	}, [usersQuery.data, memberIds]);

	const handleAddUser = () => {
		if (!selectedUserId) return;
		addUserMutation.mutate(
			{ teamId, userId: Number(selectedUserId) },
			{
				onSuccess: () => {
					setSelectedUserId("");
				},
			},
		);
	};

	const handleRemoveUser = (userId: number) => {
		removeUserMutation.mutate({ teamId, userId });
	};

	const handleClose = () => {
		setSelectedUserId("");
		onHide();
	};

	const isLoading = usersQuery.isLoading || teamQuery.isLoading;
	const isPending = addUserMutation.isPending || removeUserMutation.isPending;

	return (
		<Modal onHide={handleClose} show={show} size="lg">
			<ModalHeader closeButton>
				<ModalTitle>Mitglieder verwalten: {teamName}</ModalTitle>
			</ModalHeader>
			<ModalBody>
				{isLoading ? (
					<div className="py-4 text-center">
						<Spinner animation="border" role="status">
							<span className="visually-hidden">Laden...</span>
						</Spinner>
					</div>
				) : (
					<>
						{/* Add User Section */}
						<div className="mb-4">
							<Form.Label className="fw-bold">Benutzer hinzufügen</Form.Label>
							<div className="d-flex gap-2">
								<FormSelect
									disabled={isPending || availableUsers.length === 0}
									onChange={(e) => setSelectedUserId(e.target.value)}
									value={selectedUserId}
								>
									<option value="">
										{availableUsers.length === 0
											? "Keine weiteren Benutzer verfügbar"
											: "Benutzer auswählen..."}
									</option>
									{availableUsers.map((user) => (
										<option key={user.id} value={user.id}>
											{user.name} {user.internal ? "(Intern)" : ""}
										</option>
									))}
								</FormSelect>
								<Button
									disabled={!selectedUserId || isPending}
									onClick={handleAddUser}
									variant="primary"
								>
									{addUserMutation.isPending ? "..." : "Hinzufügen"}
								</Button>
							</div>
						</div>

						{/* Current Members List */}
						<div>
							<Form.Label className="fw-bold">
								Aktuelle Mitglieder ({members.length})
							</Form.Label>
							<ListGroup style={{ maxHeight: "300px", overflowY: "auto" }}>
								{members.map((member) => (
									<ListGroupItem
										className="d-flex justify-content-between align-items-center"
										key={member.id}
									>
										<div>
											<span>{member.name}</span>
											{member.internal && (
												<span className="badge ms-2 bg-secondary">Intern</span>
											)}
										</div>
										<Button
											disabled={isPending}
											onClick={() => handleRemoveUser(member.id)}
											size="sm"
											variant="outline-danger"
										>
											{removeUserMutation.isPending ? "..." : "Entfernen"}
										</Button>
									</ListGroupItem>
								))}
								{members.length === 0 && (
									<ListGroupItem className="text-center text-muted">
										Keine Mitglieder in diesem Team
									</ListGroupItem>
								)}
							</ListGroup>
						</div>
					</>
				)}
			</ModalBody>
			<ModalFooter>
				<Button onClick={handleClose} variant="secondary">
					Schließen
				</Button>
			</ModalFooter>
		</Modal>
	);
}
