"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "react-bootstrap";
import { useDeleteUserMutation } from "~/client/requests/user";

interface DeleteUserDialogProps {
	show: boolean;
	onHide: () => void;
	userId: number;
	userName: string;
}

export function DeleteUserDialog({
	show,
	onHide,
	userId,
	userName,
}: DeleteUserDialogProps) {
	const deleteUserMutation = useDeleteUserMutation();

	const handleDelete = () => {
		deleteUserMutation.mutate(userId, {
			onSuccess: () => {
				onHide();
			},
		});
	};

	return (
		<Modal onHide={onHide} show={show}>
			<ModalHeader closeButton>
				<ModalTitle>Benutzer löschen</ModalTitle>
			</ModalHeader>
			<ModalBody>
				Möchten Sie den Benutzer <strong>{userName}</strong> wirklich löschen?
			</ModalBody>
			<ModalFooter>
				<Button onClick={onHide} variant="secondary">
					Abbrechen
				</Button>
				<Button
					disabled={deleteUserMutation.isPending}
					onClick={handleDelete}
					variant="danger"
				>
					{deleteUserMutation.isPending ? "Löschen..." : "Löschen"}
				</Button>
			</ModalFooter>
		</Modal>
	);
}
