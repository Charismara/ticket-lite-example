"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import {
	Alert,
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	Col,
	Container,
	Form,
	FormCheck,
	FormControl,
	FormGroup,
	FormLabel,
	FormSelect,
	Row,
} from "react-bootstrap";
import { useSelectedUser } from "~/client/context/UserContext";
import {
	useCommentsQuery,
	useCreateCommentMutation,
} from "~/client/requests/comment";
import { useTeamsQuery } from "~/client/requests/team";
import {
	useTicketQuery,
	useUpdateTicketMutation,
} from "~/client/requests/ticket";
import { useUsersQuery, useUserWithTeamsQuery } from "~/client/requests/user";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { dayjs } from "~/utils/dayjs";

type TicketStatus = "offen" | "in bearbeitung" | "abgeschlossen";

export default function TicketDetailPage() {
	const params = useParams<{ id: string }>();
	const ticketId = Number(params.id);

	const ticketQuery = useTicketQuery(ticketId);
	const commentsQuery = useCommentsQuery(ticketId);
	const usersQuery = useUsersQuery();
	const teamsQuery = useTeamsQuery();
	const { selectedUser, selectedUserId } = useSelectedUser();
	const userWithTeamsQuery = useUserWithTeamsQuery(selectedUserId);
	const updateTicketMutation = useUpdateTicketMutation();
	const createCommentMutation = useCreateCommentMutation();

	const userTeams = userWithTeamsQuery.data?.teams ?? [];

	const [commentUserId, setCommentUserId] = useState<number | null>(null);
	const [commentText, setCommentText] = useState("");
	const [commentInternalOnly, setCommentInternalOnly] = useState(false);

	const handleStatusChange = (newStatus: TicketStatus) => {
		updateTicketMutation.mutate({
			id: ticketId,
			input: { status: newStatus },
		});
	};

	const handleAssignmentChange = (userId: number | null) => {
		updateTicketMutation.mutate({
			id: ticketId,
			input: { assignedUserId: userId },
		});
	};

	const handleTeamChange = (teamId: number) => {
		updateTicketMutation.mutate({
			id: ticketId,
			input: { responsibleTeamId: teamId },
		});
	};

	const handleCommentSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!commentUserId || !commentText.trim()) return;

		createCommentMutation
			.mutateAsync({
				ticketId,
				input: {
					userId: commentUserId,
					comment: commentText,
					internalOnly: commentInternalOnly,
				},
			})
			.then(() => {
				setCommentText("");
				setCommentInternalOnly(false);
			});
	};

	const getAssignedUserName = () => {
		if (!ticketQuery.data?.assignedUserId) return "Nicht zugewiesen";
		const user = usersQuery.data?.find(
			(u) => u.id === ticketQuery.data?.assignedUserId,
		);
		return user?.name ?? "Unbekannt";
	};

	const getResponsibleTeamName = () => {
		if (!ticketQuery.data?.responsibleTeamId) return "Kein Team";
		const team = teamsQuery.data?.find(
			(t) => t.id === ticketQuery.data?.responsibleTeamId,
		);
		return team?.name ?? "Unbekannt";
	};

	const getCommentAuthorName = (userId: number) => {
		const user = usersQuery.data?.find((u) => u.id === userId);
		return user?.name ?? "Unbekannt";
	};

	if (ticketQuery.isLoading) {
		return (
			<Container className="py-4 text-center">
				<LoadingSpinner />
			</Container>
		);
	}

	if (!ticketQuery.data) {
		return (
			<Container className="py-4">
				<Alert variant="danger">Ticket nicht gefunden.</Alert>
				<Link href="/tickets">
					<Button variant="secondary">Zurück zur Übersicht</Button>
				</Link>
			</Container>
		);
	}

	const ticket = ticketQuery.data;

	return (
		<Container className="py-4">
			<div className="d-flex justify-content-between mb-4 align-items-center">
				<h1 className="mb-0">Ticket #{ticket.id}</h1>
				<Link href="/tickets">
					<Button variant="outline-secondary">Zurück zur Übersicht</Button>
				</Link>
			</div>

			<Row>
				<Col lg={8}>
					{/* Ticket Details */}
					<Card className="mb-4">
						<CardHeader>
							<h5 className="mb-0">Details</h5>
						</CardHeader>
						<CardBody>
							<dl className="row mb-0">
								<dt className="col-sm-3">Titel</dt>
								<dd className="col-sm-9">{ticket.title}</dd>

								<dt className="col-sm-3">Beschreibung</dt>
								<dd className="col-sm-9" style={{ whiteSpace: "pre-wrap" }}>
									{ticket.description}
								</dd>

								<dt className="col-sm-3">Verantwortliches Team</dt>
								<dd className="col-sm-9">{getResponsibleTeamName()}</dd>

								<dt className="col-sm-3">Erstellt am</dt>
								<dd className="col-sm-9">
									{dayjs(ticket.createdAt).format("DD.MM.YYYY HH:mm")}
								</dd>

								<dt className="col-sm-3">Aktualisiert am</dt>
								<dd className="col-sm-9">
									{ticket.updatedAt
										? dayjs(ticket.updatedAt).format("DD.MM.YYYY HH:mm")
										: "-"}
								</dd>
							</dl>
						</CardBody>
					</Card>

					{/* Kommentare */}
					<Card className="mb-4">
						<CardHeader>
							<h5 className="mb-0">Kommentare</h5>
						</CardHeader>
						<CardBody>
							{commentsQuery.isLoading ? (
								<div className="text-center">
									<LoadingSpinner />
								</div>
							) : commentsQuery.data?.length === 0 ? (
								<p className="mb-0 text-muted">Noch keine Kommentare.</p>
							) : (
								<div className="d-flex flex-column gap-3">
									{commentsQuery.data
										?.filter((c) => !c.internalOnly || selectedUser?.internal)
										.map((c) => (
											<div className="border-bottom pb-3" key={c.id}>
												<div className="d-flex justify-content-between mb-2 align-items-start">
													<strong>{getCommentAuthorName(c.userId)}</strong>
													<small className="text-muted">
														{dayjs(c.createdAt).format("DD.MM.YYYY HH:mm")}
													</small>
												</div>
												<p className="mb-1" style={{ whiteSpace: "pre-wrap" }}>
													{c.comment}
												</p>
												{c.internalOnly && (
													<Badge bg="secondary">Nur intern</Badge>
												)}
											</div>
										))}
								</div>
							)}

							<hr className="my-4" />

							{/* Neuer Kommentar */}
							<h6>Neuer Kommentar</h6>
							<Form onSubmit={handleCommentSubmit}>
								<FormGroup className="mb-3">
									<FormLabel>Benutzer</FormLabel>
									<FormSelect
										onChange={(e) =>
											setCommentUserId(
												e.target.value ? Number(e.target.value) : null,
											)
										}
										required
										value={commentUserId ?? ""}
									>
										<option value="">Benutzer auswählen...</option>
										{usersQuery.data?.map((user) => (
											<option key={user.id} value={user.id}>
												{user.name}
											</option>
										))}
									</FormSelect>
								</FormGroup>
								<FormGroup className="mb-3">
									<FormLabel>Kommentar</FormLabel>
									<FormControl
										as="textarea"
										onChange={(e) => setCommentText(e.target.value)}
										placeholder="Kommentar eingeben..."
										required
										rows={3}
										value={commentText}
									/>
								</FormGroup>
								<FormGroup className="mb-3">
									<FormCheck
										checked={commentInternalOnly}
										label="Nur intern sichtbar"
										onChange={(e) => setCommentInternalOnly(e.target.checked)}
										type="checkbox"
									/>
								</FormGroup>
								<Button
									disabled={createCommentMutation.isPending}
									type="submit"
									variant="primary"
								>
									{createCommentMutation.isPending
										? "Speichern..."
										: "Kommentar hinzufügen"}
								</Button>
							</Form>
						</CardBody>
					</Card>
				</Col>

				<Col lg={4}>
					{/* Status & Zuweisung */}
					<Card className="mb-4">
						<CardHeader>
							<h5 className="mb-0">Status & Zuweisung</h5>
						</CardHeader>
						<CardBody>
							<FormGroup className="mb-3">
								<FormLabel>Status</FormLabel>
								<FormSelect
									disabled={updateTicketMutation.isPending}
									onChange={(e) =>
										handleStatusChange(e.target.value as TicketStatus)
									}
									value={ticket.status}
								>
									<option value="offen">Offen</option>
									<option value="in bearbeitung">In Bearbeitung</option>
									<option value="abgeschlossen">Abgeschlossen</option>
								</FormSelect>
							</FormGroup>

							<FormGroup className="mb-3">
								<FormLabel>Verantwortliches Team</FormLabel>
								<FormSelect
									disabled={updateTicketMutation.isPending}
									onChange={(e) => handleTeamChange(Number(e.target.value))}
									value={ticket.responsibleTeamId}
								>
									{userTeams.map((team) => (
										<option key={team.id} value={team.id}>
											{team.name}
										</option>
									))}
								</FormSelect>
							</FormGroup>

							<FormGroup className="mb-3">
								<FormLabel>Zugewiesen an</FormLabel>
								<FormSelect
									disabled={updateTicketMutation.isPending}
									onChange={(e) =>
										handleAssignmentChange(
											e.target.value ? Number(e.target.value) : null,
										)
									}
									value={ticket.assignedUserId ?? ""}
								>
									<option value="">Nicht zugewiesen</option>
									{usersQuery.data?.map((user) => (
										<option key={user.id} value={user.id}>
											{user.name}
										</option>
									))}
								</FormSelect>
							</FormGroup>

							<div className="mt-3">
								<small className="text-muted">
									Aktuell: <StatusBadge status={ticket.status} /> -{" "}
									{getAssignedUserName()}
								</small>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

function StatusBadge({
	status,
}: {
	status: "offen" | "in bearbeitung" | "abgeschlossen";
}) {
	const variants: Record<typeof status, string> = {
		offen: "warning",
		"in bearbeitung": "primary",
		abgeschlossen: "success",
	};

	const labels: Record<typeof status, string> = {
		offen: "Offen",
		"in bearbeitung": "In Bearbeitung",
		abgeschlossen: "Abgeschlossen",
	};

	return <Badge bg={variants[status]}>{labels[status]}</Badge>;
}
