"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "react-bootstrap";
import { useDeleteTicketMutation } from "~/client/requests/ticket";

type DeleteTicketDialogProps = {
	show: boolean;
	onHide(): void;
	ticketId: number;
	ticketTitle: string;
};

export function DeleteTicketDialog({
	show,
	onHide,
	ticketId,
	ticketTitle,
}: DeleteTicketDialogProps) {
	const deleteTicketMutation = useDeleteTicketMutation();

	const handleDelete = () => {
		deleteTicketMutation.mutate(ticketId, {
			onSuccess: () => {
				onHide();
			},
		});
	};

	return (
		<Modal onHide={onHide} show={show}>
			<ModalHeader closeButton>
				<ModalTitle>Ticket löschen</ModalTitle>
			</ModalHeader>
			<ModalBody>
				Möchten Sie das Ticket <strong>{ticketTitle}</strong> wirklich löschen?
			</ModalBody>
			<ModalFooter>
				<Button onClick={onHide} variant="secondary">
					Abbrechen
				</Button>
				<Button
					disabled={deleteTicketMutation.isPending}
					onClick={handleDelete}
					variant="danger"
				>
					{deleteTicketMutation.isPending ? "Löschen..." : "Löschen"}
				</Button>
			</ModalFooter>
		</Modal>
	);
}
