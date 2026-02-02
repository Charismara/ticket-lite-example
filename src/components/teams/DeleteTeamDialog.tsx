"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "react-bootstrap";
import { useDeleteTeamMutation } from "~/client/requests/team";

type DeleteTeamDialogProps = {
	show: boolean;
	onHide: () => void;
	teamId: number;
	teamName: string;
};

export function DeleteTeamDialog({
	show,
	onHide,
	teamId,
	teamName,
}: DeleteTeamDialogProps) {
	const deleteTeamMutation = useDeleteTeamMutation();

	const handleDelete = () => {
		deleteTeamMutation.mutate(teamId, {
			onSuccess: () => {
				onHide();
			},
		});
	};

	return (
		<Modal onHide={onHide} show={show}>
			<ModalHeader closeButton>
				<ModalTitle>Team löschen</ModalTitle>
			</ModalHeader>
			<ModalBody>
				Möchten Sie das Team <strong>{teamName}</strong> wirklich löschen?
				<br />
				<small className="text-muted">
					Alle Mitgliederzuordnungen werden ebenfalls entfernt.
				</small>
			</ModalBody>
			<ModalFooter>
				<Button onClick={onHide} variant="secondary">
					Abbrechen
				</Button>
				<Button
					disabled={deleteTeamMutation.isPending}
					onClick={handleDelete}
					variant="danger"
				>
					{deleteTeamMutation.isPending ? "Löschen..." : "Löschen"}
				</Button>
			</ModalFooter>
		</Modal>
	);
}
