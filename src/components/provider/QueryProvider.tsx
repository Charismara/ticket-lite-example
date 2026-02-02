"use client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/query-core";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import ms from "ms";
import type { PropsWithChildren } from "react";

const client = new QueryClient({
	defaultOptions: {
		queries: {
			// @ts-expect-error - Typing not complete yet
			cacheTime: ms("30m"),
		},
	},
});

const asyncStoragePersister = createAsyncStoragePersister({
	storage: typeof window !== "undefined" ? window.localStorage : null,
});

export const QueryProvider = ({ children }: PropsWithChildren) => {
	return (
		<PersistQueryClientProvider
			client={client}
			persistOptions={{ persister: asyncStoragePersister }}
		>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</PersistQueryClientProvider>
	);
};
