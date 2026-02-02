"use client";

import dynamic from "next/dynamic";
import {
	Card,
	CardBody,
	CardHeader,
	CardText,
	CardTitle,
	Col,
	Container,
	Row,
} from "react-bootstrap";
import { LoadingSpinner } from "~/components/LoadingSpinner";

const OpenTicketsTitle = dynamic(
	() =>
		import("~/components/dashboard/OpenTicketsCard").then(
			(mod) => mod.OpenTicketsTitle,
		),
	{ ssr: false, loading: () => <LoadingSpinner disableAnimation /> },
);

const TicketsInProgressTitle = dynamic(
	() =>
		import("~/components/dashboard/TicketsInProgressCard").then(
			(mod) => mod.TicketsInProgressTitle,
		),
	{ ssr: false, loading: () => <LoadingSpinner disableAnimation /> },
);

const TicketsCreatedThisWeekTitle = dynamic(
	() =>
		import("~/components/dashboard/TicketsCreatedThisWeekCard").then(
			(mod) => mod.TicketsCreatedThisWeekTitle,
		),
	{ ssr: false, loading: () => <LoadingSpinner disableAnimation /> },
);

const TicketsClosedThisWeekTitle = dynamic(
	() =>
		import("~/components/dashboard/TicketsClosedThisWeekCard").then(
			(mod) => mod.TicketsClosedThisWeekTitle,
		),
	{ ssr: false, loading: () => <LoadingSpinner disableAnimation /> },
);

export default function Home() {
	return (
		<Container>
			<Row
				className={"py-2"}
				style={{ width: "min(70vw, 800px)", margin: "auto", minWidth: 350 }}
			>
				<Col>
					<Card>
						<CardBody>
							<CardTitle className={"text-center"}>Ticket Lite</CardTitle>
							<CardText>
								Ein einfaches Ticket-Management-System zur Verwaltung kleiner
								Tasks.
								<br />
								Jetzt komplett in TypeScript dank Next.js 16!
							</CardText>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<Row
				className={"py-2"}
				style={{ width: "min(70vw, 800px)", margin: "auto", minWidth: 350 }}
			>
				<Col>
					<Card>
						<CardHeader>Offene Tickets</CardHeader>
						<CardBody>
							<CardTitle className={"text-center"}>
								<OpenTicketsTitle />
							</CardTitle>
						</CardBody>
					</Card>
				</Col>
				<Col>
					<Card>
						<CardHeader>Tickets in bearbeitung</CardHeader>
						<CardBody>
							<CardTitle className={"text-center"}>
								<TicketsInProgressTitle />
							</CardTitle>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<Row
				className={"py-2"}
				style={{ width: "min(70vw, 800px)", margin: "auto", minWidth: 350 }}
			>
				<Col>
					<Card>
						<CardHeader>Diese Woche geöffnet</CardHeader>
						<CardBody>
							<CardTitle className={"text-center"}>
								<TicketsCreatedThisWeekTitle />
							</CardTitle>
						</CardBody>
					</Card>
				</Col>
				<Col>
					<Card>
						<CardHeader>Diese Woche geschlossen</CardHeader>
						<CardBody>
							<CardTitle className={"text-center"}>
								<TicketsClosedThisWeekTitle />
							</CardTitle>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
