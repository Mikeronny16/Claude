import Anthropic from "@anthropic-ai/sdk";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
	COPILOT_MODEL,
	COPILOT_SYSTEM_PROMPT,
	COPILOT_TOOLS,
	planFromClaudeContent,
} from "@/copilot/claude";
import { isWebEnvConfigured } from "@/env/web";
import { notConfiguredResponse } from "@/env/not-configured-response";

const MAX_CONTEXT_CHARACTERS = 200_000;

const bodySchema = z.object({
	request: z.string().trim().min(1).max(2_000),
	context: z.record(z.string(), z.unknown()),
});

/** Whether Claude is available; without it the Copilot uses demo mode. */
export async function GET() {
	return NextResponse.json({ configured: isWebEnvConfigured("ANTHROPIC_API_KEY") });
}

export async function POST(request: NextRequest) {
	if (!isWebEnvConfigured("ANTHROPIC_API_KEY")) {
		return notConfiguredResponse({ feature: "AI Copilot" });
	}

	const body = bodySchema.safeParse(await request.json().catch(() => null));
	if (!body.success) {
		return NextResponse.json({ error: "Invalid input" }, { status: 400 });
	}
	const timeline = JSON.stringify(body.data.context);
	if (timeline.length > MAX_CONTEXT_CHARACTERS) {
		return NextResponse.json(
			{ error: "This timeline is too large for the Copilot." },
			{ status: 413 },
		);
	}

	// Reads ANTHROPIC_API_KEY from the environment.
	const client = new Anthropic();
	try {
		const message = await client.messages.create({
			model: COPILOT_MODEL,
			max_tokens: 16000,
			thinking: { type: "adaptive" },
			system: COPILOT_SYSTEM_PROMPT,
			tools: COPILOT_TOOLS,
			messages: [
				{
					role: "user",
					content: `Timeline:\n${timeline}\n\nRequest: ${body.data.request}`,
				},
			],
		});
		return NextResponse.json({ plan: planFromClaudeContent({ content: message.content }) });
	} catch (error) {
		if (error instanceof Anthropic.AuthenticationError) {
			return NextResponse.json(
				{ error: "The Claude API key was rejected. Check ANTHROPIC_API_KEY." },
				{ status: 401 },
			);
		}
		if (error instanceof Anthropic.RateLimitError) {
			return NextResponse.json(
				{ error: "Claude is busy right now. Try again in a moment." },
				{ status: 429 },
			);
		}
		if (error instanceof Anthropic.APIConnectionError) {
			return NextResponse.json(
				{ error: "Couldn't reach Claude. Check the internet connection." },
				{ status: 502 },
			);
		}
		if (error instanceof Anthropic.APIError) {
			return NextResponse.json(
				{ error: `Claude returned an error (${error.status ?? "unknown"}).` },
				{ status: 502 },
			);
		}
		throw error;
	}
}
