"use client";

import { type FormEvent, useState } from "react";
import {
	Button,
	Form,
	FormControl,
	FormGroup,
	FormLabel,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "react-bootstrap";
import { useCreateTeamMutation } from "~/client/requests/team";

type CreateTeamDialogProps = {
	show: boolean;
	onHide: () => void;
};

export function CreateTeamDialog({ show, onHide }: CreateTeamDialogProps) {
	const [name, setName] = useState("");
	const createTeamMutation = useCreateTeamMutation();

	const handleClose = () => {
		setName("");
		onHide();
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		createTeamMutation.mutateAsync({ name }).then(handleClose);
	};

	return (
		<Modal onHide={handleClose} show={show}>
			<Form onSubmit={handleSubmit}>
				<ModalHeader closeButton>
					<ModalTitle>Neues Team</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<FormGroup className="mb-3">
						<FormLabel>Name</FormLabel>
						<FormControl
							onChange={(e) => setName(e.target.value)}
							placeholder="Teamname eingeben"
							required
							type="text"
							value={name}
						/>
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<Button onClick={handleClose} variant="secondary">
						Abbrechen
					</Button>
					<Button
						disabled={createTeamMutation.isPending}
						type="submit"
						variant="primary"
					>
						{createTeamMutation.isPending ? "Speichern..." : "Speichern"}
					</Button>
				</ModalFooter>
			</Form>
		</Modal>
	);
}
