import { type NextRequest, NextResponse } from "next/server";
import {
	type CreateUserInput,
	createUser,
	getUsers,
} from "~/server/actions/user";

export async function POST(request: NextRequest) {
	const body = (await request.json()) as CreateUserInput;

	const newUser = await createUser(body);

	return NextResponse.json(newUser, { status: 201 });
}

export const GET = async () => {
	return NextResponse.json(await getUsers());
};
