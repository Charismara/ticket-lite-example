import "~/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { QueryProvider } from "~/components/provider/QueryProvider";
import { RootLayout } from "~/components/RootLayout";

export const metadata: Metadata = {
	title: "Ticket Lite ",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function Layout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="de" suppressHydrationWarning>
			<body>
				<QueryProvider>
					<RootLayout>{children}</RootLayout>
				</QueryProvider>
			</body>
		</html>
	);
}
