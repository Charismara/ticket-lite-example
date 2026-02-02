"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type PropsWithChildren, Suspense } from "react";
import {
	Button,
	Container,
	Form,
	FormSelect,
	Nav,
	Navbar,
	NavbarBrand,
	NavbarCollapse,
	NavbarToggle,
	NavLink,
} from "react-bootstrap";
import {
	ColorModeProvider,
	useColorMode,
} from "~/client/context/ColorModeContext";
import { useSelectedUser } from "~/client/context/UserContext";
import { LoadingSpinner } from "~/components/LoadingSpinner";

const NavbarContent = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { selectedUserId, setSelectedUserId, users } = useSelectedUser();
	const { colorMode, toggleColorMode } = useColorMode();

	// Build href with preserved userId query parameter
	const buildHref = (path: string) => {
		const userId = searchParams.get("userId");
		return userId ? `${path}?userId=${userId}` : path;
	};

	return (
		<Navbar className="mb-3 bg-body-tertiary" expand="lg">
			<Container>
				<NavbarBrand as={Link} href={buildHref("/")}>
					Ticket Lite
				</NavbarBrand>
				<NavbarToggle aria-controls="basic-navbar-nav" />
				<NavbarCollapse id="basic-navbar-nav">
					<Nav activeKey={pathname} className="me-auto">
						<NavLink as={Link} href={buildHref("/users")}>
							Users
						</NavLink>
						<NavLink as={Link} href={buildHref("/teams")}>
							Teams
						</NavLink>
						<NavLink as={Link} href={buildHref("/tickets")}>
							Tickets
						</NavLink>
					</Nav>
					<div className="align-items-center d-flex gap-2">
						<Button
							aria-label={
								colorMode === "light"
									? "Dunkelmodus aktivieren"
									: "Hellmodus aktivieren"
							}
							onClick={toggleColorMode}
							variant="outline-secondary"
						>
							<i
								className={
									colorMode === "light" ? "bi bi-moon-fill" : "bi bi-sun-fill"
								}
							/>
						</Button>
						<Form className="justify-content-end">
							<FormSelect
								onChange={(e) =>
									setSelectedUserId(
										e.target.value ? Number(e.target.value) : null,
									)
								}
								style={{ minWidth: "180px" }}
								value={selectedUserId ?? ""}
							>
								<option value="">Benutzer wählen...</option>
								{users.map((user) => (
									<option key={user.id} value={user.id}>
										{user.name}
									</option>
								))}
							</FormSelect>
						</Form>
					</div>
				</NavbarCollapse>
			</Container>
		</Navbar>
	);
};

const RootLayoutContent = ({ children }: PropsWithChildren) => {
	return (
		<>
			<NavbarContent />
			{children}
		</>
	);
};

export const RootLayout = ({ children }: PropsWithChildren) => {
	return (
		<ColorModeProvider>
			<Suspense fallback={<LoadingSpinner />}>
				<RootLayoutContent>{children}</RootLayoutContent>
			</Suspense>
		</ColorModeProvider>
	);
};
