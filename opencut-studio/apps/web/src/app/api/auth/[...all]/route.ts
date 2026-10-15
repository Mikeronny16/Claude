import { getAuth, isAuthConfigured } from "@/auth/server";
import { notConfiguredResponse } from "@/env/not-configured-response";
import { toNextJsHandler } from "better-auth/next-js";

function handler() {
	return isAuthConfigured() ? toNextJsHandler(getAuth()) : null;
}

export async function GET(request: Request) {
	return handler()?.GET(request) ?? notConfiguredResponse({ feature: "Accounts" });
}

export async function POST(request: Request) {
	return handler()?.POST(request) ?? notConfiguredResponse({ feature: "Accounts" });
}
