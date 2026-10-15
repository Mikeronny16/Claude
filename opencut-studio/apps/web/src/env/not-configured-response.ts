import { NextResponse } from "next/server";

export function notConfiguredResponse({ feature }: { feature: string }) {
	return NextResponse.json(
		{
			error: "Not configured",
			message: `${feature} is not available in this build.`,
		},
		{ status: 503 },
	);
}
