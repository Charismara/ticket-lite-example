"use client";

import { type SubmitEventHandler, useState } from "react";
import {
	Button,
	Form,
	FormCheck,
	FormControl,
	FormGroup,
	FormLabel,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "react-bootstrap";
import { useCreateUserMutation } from "~/client/requests/user";

interface CreateUserDialogProps {
	show: boolean;
	onHide: () => void;
}

export function CreateUserDialog({ show, onHide }: CreateUserDialogProps) {
	const [name, setName] = useState("");
	const [internal, setInternal] = useState(true);
	const createUserMutation = useCreateUserMutation();

	const handleClose = () => {
		setName("");
		setInternal(true);
		onHide();
	};

	const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		createUserMutation.mutateAsync({ name, internal }).then(handleClose);
	};

	return (
		<Modal onHide={handleClose} show={show}>
			<Form onSubmit={handleSubmit}>
				<ModalHeader closeButton>
					<ModalTitle>Neuer Benutzer</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<FormGroup className="mb-3">
						<FormLabel>Name</FormLabel>
						<FormControl
							onChange={(e) => setName(e.target.value)}
							placeholder="Name eingeben"
							required
							type="text"
							value={name}
						/>
					</FormGroup>
					<FormGroup className="mb-3">
						<FormCheck
							checked={internal}
							label="Interner Benutzer"
							onChange={(e) => setInternal(e.target.checked)}
							type="checkbox"
						/>
					</FormGroup>
				</ModalBody>
				<ModalFooter>
					<Button onClick={handleClose} variant="secondary">
						Abbrechen
					</Button>
					<Button
						disabled={createUserMutation.isPending}
						type="submit"
						variant="primary"
					>
						{createUserMutation.isPending ? "Speichern..." : "Speichern"}
					</Button>
				</ModalFooter>
			</Form>
		</Modal>
	);
}
