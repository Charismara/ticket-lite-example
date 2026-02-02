"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useUsersQuery } from "~/client/requests/user";

export const useSelectedUser = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const usersQuery = useUsersQuery();

	const users = usersQuery.data ?? [];

	// Parse userId from query parameter and validate
	const userIdParam = searchParams.get("userId");
	const parsedUserId = userIdParam ? Number(userIdParam) : null;

	// Validate: Check if user exists, otherwise return null
	const selectedUserId =
		parsedUserId !== null &&
		!Number.isNaN(parsedUserId) &&
		users.some((user) => user.id === parsedUserId)
			? parsedUserId
			: null;

	const selectedUser = users.find((user) => user.id === selectedUserId);

	const setSelectedUserId = useCallback(
		(userId: number | null) => {
			const params = new URLSearchParams(searchParams.toString());

			if (userId !== null) {
				params.set("userId", String(userId));
			} else {
				params.delete("userId");
			}

			const queryString = params.toString();
			const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

			router.replace(newUrl as never, { scroll: false });
		},
		[router, pathname, searchParams],
	);

	return {
		selectedUserId,
		setSelectedUserId,
		selectedUser,
		users,
		isLoading: usersQuery.isLoading,
	};
};
