"use client";

import { type FormEvent, useState } from "react";
import {
	Button,
	Form,
	FormControl,
	FormGroup,
	FormLabel,
	FormSelect,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "react-bootstrap";
import { useSelectedUser } from "~/client/context/UserContext";
import { useCreateTicketMutation } from "~/client/requests/ticket";
import { useUsersQuery, useUserWithTeamsQuery } from "~/client/requests/user";

type CreateTicketDialogProps = {
	show: boolean;
	onHide(): void;
};

export function CreateTicketDialog({ show, onHide }: CreateTicketDialogProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState<
		"offen" | "in bearbeitung" | "abgeschlossen"
	>("offen");
	const [assignedUserId, setAssignedUserId] = useState<number | null>(null);
	const [responsibleTeamId, setResponsibleTeamId] = useState<number | null>(
		null,
	);

	const createTicketMutation = useCreateTicketMutation();
	const usersQuery = useUsersQuery();
	const { selectedUserId } = useSelectedUser();
	const userWithTeamsQuery = useUserWithTeamsQuery(selectedUserId);

	const userTeams = userWithTeamsQuery.data?.teams ?? [];

	const handleClose = () => {
		setTitle("");
		setDescription("");
		setStatus("offen");
		setAssignedUserId(null);
		setResponsibleTeamId(null);
		onHide();
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!responsibleTeamId) return;
		createTicketMutation
			.mutateAsync({
				title,
				description,
				status,
				assignedUserId,
				responsibleTeamId,
			})
			.then(handleClose);
	};

	return (
		<Modal onHide={handleClose} show={show} size="lg">
			<Form onSubmit={handleSubmit}>
				<ModalHeader closeButton>
					<ModalTitle>Neues Ticket</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<FormGroup className="mb-3">
						<FormLabel>Titel</FormLabel>
						<FormControl
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Titel eingeben"
							required
							type="text"
							value={title}
						/>
					</FormGroup>
					<FormGroup className="mb-3">
						<FormLabel>Beschreibung</FormLabel>
						<FormControl
							as="textarea"
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Beschreibung eingeben"
							required
							rows={4}
							value={description}
						/>
					</FormGroup>
					<FormGroup className="mb-3">
						<FormLabel>Verantwortliches Team</FormLabel>
						<FormSelect
							onChange={(e) =>
								setResponsibleTeamId(
									e.target.value ? Number(e.target.value) : null,
								)
							}
							required
							value={responsibleTeamId ?? ""}
						>
							<option value="">Team auswählen...</option>
							{userTeams.map((team) => (
								<option key={team.id} value={team.id}>
									{team.name}
								</option>
							))}
						</FormSelect>
					</FormGroup>
					<FormGroup className="mb-3">
						<FormLabel>Status</FormLabel>
						<FormSelect
							onChange={(e) =>
								setStatus(
									e.target.value as
										| "offen"
										| "in bearbeitung"
										| "abgeschlossen",
								)
							}
							value={status}
						>
							<option value="offen">Offen</option>
							<option value="in bearbeitung">In Bearbeitung</option>
							<option value="abgeschlossen">Abgeschlossen</option>
						</FormSelect>
					</FormGroup>
					<FormGroup className="mb-3">
						<FormLabel>Zugewiesen an</FormLabel>
						<FormSelect
							onChange={(e) =>
								setAssignedUserId(
									e.target.value ? Number(e.target.value) : null,
								)
							}
							value={assignedUserId ?? ""}
						>
							<option value="">Nicht zugewiesen</option>
							{usersQuery.data?.map((user) => (
								<option key={user.id} value={user.id}>
									{user.name}
								</option>
							))}
						</FormSelect>
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<Button onClick={handleClose} variant="secondary">
						Abbrechen
					</Button>
					<Button
						disabled={createTicketMutation.isPending || !responsibleTeamId}
						type="submit"
						variant="primary"
					>
						{createTicketMutation.isPending ? "Speichern..." : "Speichern"}
					</Button>
				</ModalFooter>
			</Form>
		</Modal>
	);
}
