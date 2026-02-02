"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
	Alert,
	Badge,
	Button,
	Col,
	Container,
	Form,
	FormCheck,
	FormControl,
	FormGroup,
	FormLabel,
	FormSelect,
	Pagination,
	Row,
	Table,
} from "react-bootstrap";
import { useSelectedUser } from "~/client/context/UserContext";
import { useTeamsQuery } from "~/client/requests/team";
import { useTicketsByTeamIdsQuery } from "~/client/requests/ticket";
import { useUserWithTeamsQuery } from "~/client/requests/user";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { CreateTicketDialog } from "~/components/tickets/CreateTicketDialog";
import { DeleteTicketDialog } from "~/components/tickets/DeleteTicketDialog";
import { dayjs } from "~/utils/dayjs";

type TicketStatus = "offen" | "in bearbeitung" | "abgeschlossen";

type FilterState = {
	search: string;
	status: TicketStatus | "alle";
	showClosed: boolean;
	createdFrom: string;
	createdTo: string;
	updatedFrom: string;
	updatedTo: string;
	teamId: number | "alle";
};

export default function TicketsPage() {
	const { selectedUserId } = useSelectedUser();
	const userWithTeamsQuery = useUserWithTeamsQuery(selectedUserId);
	const teamsQuery = useTeamsQuery();

	const userTeams = userWithTeamsQuery.data?.teams ?? [];
	const userTeamIds = userTeams.map((t) => t.id);

	const ticketsQuery = useTicketsByTeamIdsQuery(userTeamIds);

	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [deleteTicket, setDeleteTicket] = useState<{
		id: number;
		title: string;
	} | null>(null);

	const [filters, setFilters] = useState<FilterState>({
		search: "",
		status: "alle",
		showClosed: false,
		createdFrom: "",
		createdTo: "",
		updatedFrom: "",
		updatedTo: "",
		teamId: "alle",
	});

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const filteredTickets = useMemo(() => {
		if (!ticketsQuery.data) return [];

		return ticketsQuery.data.filter((ticket) => {
			// Geschlossene Tickets ausblenden wenn nicht aktiviert
			if (!filters.showClosed && ticket.status === "abgeschlossen") {
				return false;
			}

			// Suche nach Titel oder ID
			if (filters.search) {
				const searchLower = filters.search.toLowerCase();
				const matchesTitle = ticket.title.toLowerCase().includes(searchLower);
				const matchesId = ticket.id.toString().includes(filters.search);
				if (!matchesTitle && !matchesId) {
					return false;
				}
			}

			// Status-Filter (nur wenn nicht "alle" und Ticket nicht geschlossen oder showClosed aktiv)
			if (filters.status !== "alle" && ticket.status !== filters.status) {
				return false;
			}

			// Team-Filter
			if (
				filters.teamId !== "alle" &&
				ticket.responsibleTeamId !== filters.teamId
			) {
				return false;
			}

			// Erstellt Von-Bis Filter
			if (filters.createdFrom) {
				const fromDate = dayjs(filters.createdFrom).startOf("day");
				if (dayjs(ticket.createdAt).isBefore(fromDate)) {
					return false;
				}
			}
			if (filters.createdTo) {
				const toDate = dayjs(filters.createdTo).endOf("day");
				if (dayjs(ticket.createdAt).isAfter(toDate)) {
					return false;
				}
			}

			// Geändert Von-Bis Filter
			if (filters.updatedFrom && ticket.updatedAt) {
				const fromDate = dayjs(filters.updatedFrom).startOf("day");
				if (dayjs(ticket.updatedAt).isBefore(fromDate)) {
					return false;
				}
			}
			if (filters.updatedTo && ticket.updatedAt) {
				const toDate = dayjs(filters.updatedTo).endOf("day");
				if (dayjs(ticket.updatedAt).isAfter(toDate)) {
					return false;
				}
			}

			return true;
		});
	}, [ticketsQuery.data, filters]);

	const paginatedTickets = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredTickets, currentPage, itemsPerPage]);

	const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

	const handleFilterChange = (
		key: keyof FilterState,
		value: string | boolean | number,
	) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
		setCurrentPage(1);
	};

	const handleItemsPerPageChange = (value: number) => {
		setItemsPerPage(value);
		setCurrentPage(1);
	};

	const resetFilters = () => {
		setFilters({
			search: "",
			status: "alle",
			showClosed: false,
			createdFrom: "",
			createdTo: "",
			updatedFrom: "",
			updatedTo: "",
			teamId: "alle",
		});
		setCurrentPage(1);
	};

	if (ticketsQuery.isLoading || userWithTeamsQuery.isLoading) {
		return (
			<Container className="py-4 text-center">
				<LoadingSpinner />
			</Container>
		);
	}

	if (!selectedUserId) {
		return (
			<Container className="py-4">
				<Alert variant="info">
					Bitte wählen Sie einen Benutzer aus, um Tickets anzuzeigen.
				</Alert>
			</Container>
		);
	}

	if (userTeams.length === 0) {
		return (
			<Container className="py-4">
				<Alert variant="info">
					Sie sind keinem Team zugeordnet. Bitte kontaktieren Sie einen
					Administrator, um einem Team beizutreten.
				</Alert>
			</Container>
		);
	}

	const getTeamName = (teamId: number) => {
		const team = teamsQuery.data?.find((t) => t.id === teamId);
		return team?.name ?? "Unbekannt";
	};

	return (
		<Container className="py-4">
			<div className="d-flex justify-content-between mb-4 align-items-center">
				<h1 className="mb-0">Tickets</h1>
				<Button onClick={() => setShowCreateDialog(true)} variant="primary">
					Neues Ticket
				</Button>
			</div>

			{/* Filter-Bereich */}
			<div className="mb-4 rounded bg-body-tertiary p-3">
				<Row className="g-3">
					<Col md={4}>
						<FormGroup>
							<FormLabel>Suche (Titel oder ID)</FormLabel>
							<FormControl
								onChange={(e) => handleFilterChange("search", e.target.value)}
								placeholder="Suchen..."
								type="text"
								value={filters.search}
							/>
						</FormGroup>
					</Col>
					<Col md={3}>
						<FormGroup>
							<FormLabel>Status</FormLabel>
							<FormSelect
								onChange={(e) => handleFilterChange("status", e.target.value)}
								value={filters.status}
							>
								<option value="alle">Alle</option>
								<option value="offen">Offen</option>
								<option value="in bearbeitung">In Bearbeitung</option>
								<option value="abgeschlossen">Abgeschlossen</option>
							</FormSelect>
						</FormGroup>
					</Col>
					<Col md={3}>
						<FormGroup>
							<FormLabel>Team</FormLabel>
							<FormSelect
								onChange={(e) =>
									handleFilterChange(
										"teamId",
										e.target.value === "alle" ? "alle" : Number(e.target.value),
									)
								}
								value={filters.teamId}
							>
								<option value="alle">Alle Teams</option>
								{userTeams.map((team) => (
									<option key={team.id} value={team.id}>
										{team.name}
									</option>
								))}
							</FormSelect>
						</FormGroup>
					</Col>
					<Col className="d-flex align-items-end" md={2}>
						<FormCheck
							checked={filters.showClosed}
							label="Geschlossene anzeigen"
							onChange={(e) =>
								handleFilterChange("showClosed", e.target.checked)
							}
							type="checkbox"
						/>
					</Col>
					<Col className="d-flex align-items-end" md={2}>
						<Button onClick={resetFilters} variant="outline-secondary">
							Filter zurücksetzen
						</Button>
					</Col>
				</Row>

				<Row className="g-3 mt-2">
					<Col md={3}>
						<FormGroup>
							<FormLabel>Erstellt von</FormLabel>
							<FormControl
								onChange={(e) =>
									handleFilterChange("createdFrom", e.target.value)
								}
								type="date"
								value={filters.createdFrom}
							/>
						</FormGroup>
					</Col>
					<Col md={3}>
						<FormGroup>
							<FormLabel>Erstellt bis</FormLabel>
							<FormControl
								onChange={(e) =>
									handleFilterChange("createdTo", e.target.value)
								}
								type="date"
								value={filters.createdTo}
							/>
						</FormGroup>
					</Col>
					<Col md={3}>
						<FormGroup>
							<FormLabel>Geändert von</FormLabel>
							<FormControl
								onChange={(e) =>
									handleFilterChange("updatedFrom", e.target.value)
								}
								type="date"
								value={filters.updatedFrom}
							/>
						</FormGroup>
					</Col>
					<Col md={3}>
						<FormGroup>
							<FormLabel>Geändert bis</FormLabel>
							<FormControl
								onChange={(e) =>
									handleFilterChange("updatedTo", e.target.value)
								}
								type="date"
								value={filters.updatedTo}
							/>
						</FormGroup>
					</Col>
				</Row>
			</div>

			{/* Tabelle */}
			<Table bordered hover responsive striped>
				<thead>
					<tr>
						<th>ID</th>
						<th>Titel</th>
						<th>Team</th>
						<th>Status</th>
						<th>Erstellt am</th>
						<th>Aktualisiert am</th>
						<th>Aktionen</th>
					</tr>
				</thead>
				<tbody>
					{paginatedTickets.length === 0 ? (
						<tr>
							<td className="text-center text-muted" colSpan={7}>
								Keine Tickets gefunden.
							</td>
						</tr>
					) : (
						paginatedTickets.map((ticket) => (
							<tr key={ticket.id}>
								<td>{ticket.id}</td>
								<td>{ticket.title}</td>
								<td>{getTeamName(ticket.responsibleTeamId)}</td>
								<td>
									<StatusBadge status={ticket.status} />
								</td>
								<td>{dayjs(ticket.createdAt).format("DD.MM.YYYY HH:mm")}</td>
								<td>
									{ticket.updatedAt
										? dayjs(ticket.updatedAt).format("DD.MM.YYYY HH:mm")
										: "-"}
								</td>
								<td>
									<Link href={`/tickets/${ticket.id}`}>
										<Button className="me-2" size="sm" variant="info">
											Ansehen
										</Button>
									</Link>
									<Button
										onClick={() =>
											setDeleteTicket({ id: ticket.id, title: ticket.title })
										}
										size="sm"
										variant="danger"
									>
										Löschen
									</Button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</Table>

			{/* Pagination */}
			<div className="d-flex justify-content-between align-items-center">
				<div className="d-flex gap-2 align-items-center">
					<span>Einträge pro Seite:</span>
					<Form.Select
						onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
						style={{ width: "auto" }}
						value={itemsPerPage}
					>
						<option value={10}>10</option>
						<option value={25}>25</option>
						<option value={50}>50</option>
					</Form.Select>
					<span className="ms-3 text-muted">
						{filteredTickets.length} Ergebnis(se)
					</span>
				</div>

				{totalPages > 1 && (
					<Pagination className="mb-0">
						<Pagination.First
							disabled={currentPage === 1}
							onClick={() => setCurrentPage(1)}
						/>
						<Pagination.Prev
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
						/>
						{Array.from({ length: totalPages }, (_, i) => i + 1)
							.filter((page) => {
								const diff = Math.abs(page - currentPage);
								return diff <= 2 || page === 1 || page === totalPages;
							})
							.map((page, index, arr) => {
								const prevPage = arr[index - 1];
								const showEllipsis = prevPage && page - prevPage > 1;
								return (
									<span key={page}>
										{showEllipsis && <Pagination.Ellipsis disabled />}
										<Pagination.Item
											active={page === currentPage}
											onClick={() => setCurrentPage(page)}
										>
											{page}
										</Pagination.Item>
									</span>
								);
							})}
						<Pagination.Next
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
						/>
						<Pagination.Last
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage(totalPages)}
						/>
					</Pagination>
				)}
			</div>

			{/* Dialoge */}
			<CreateTicketDialog
				onHide={() => setShowCreateDialog(false)}
				show={showCreateDialog}
			/>
			<DeleteTicketDialog
				onHide={() => setDeleteTicket(null)}
				show={deleteTicket !== null}
				ticketId={deleteTicket?.id ?? 0}
				ticketTitle={deleteTicket?.title ?? ""}
			/>
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
