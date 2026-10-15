import type { CopilotContext } from "./context";
import type { CopilotParam, CopilotPlan, CopilotStep } from "./steps";

// Without an AI key the Copilot still understands a few plain commands, so
// the review / preview / apply flow can be used and tested offline.

export const DEMO_HELP =
	'Demo mode understands simple commands like "remove silences", "add captions", "cut the first 2 seconds", "split at playhead", "delete selected", "opacity 50%", "rotate 15", "volume -6 dB" or "add title Hello". Add a Claude API key for anything else.';

const NUMBER = String.raw`(-?\d+(?:\.\d+)?)`;
const PARAM_PATTERNS: Array<{ param: CopilotParam; pattern: RegExp }> = [
	{ param: "opacity", pattern: new RegExp(String.raw`\bopacity\b\D*?${NUMBER}`) },
	{ param: "scale", pattern: new RegExp(String.raw`\b(?:scale|zoom|size)\b\D*?${NUMBER}`) },
	{ param: "rotation", pattern: new RegExp(String.raw`\b(?:rotate|rotation|turn)\b\D*?${NUMBER}`) },
	{ param: "volume", pattern: new RegExp(String.raw`\bvolume\b\D*?${NUMBER}`) },
];
const TEXT_PATTERN = /^(?:add|put|insert)?\s*(?:a\s+)?(?:title|text|caption)\s*[:\-]?\s*["“']?(.+?)["”']?\s*$/i;
const TIME_PATTERN = /\bat\s+(?:(\d+):)?(\d+(?:\.\d+)?)\s*s?\b/;
const EDGE_PATTERN =
	/\b(?:cut|remove|delete|trim)\s+(?:off\s+)?(?:the\s+)?(first|last)\s+(\d+(?:\.\d+)?)\s*(?:s|secs?|seconds?)?\b/;

function readTime({ text, fallback }: { text: string; fallback: number }): number {
	const match = text.match(TIME_PATTERN);
	if (!match) return fallback;
	return Number(match[1] ?? 0) * 60 + Number(match[2]);
}

function planPart({
	text,
	context,
}: {
	text: string;
	context: CopilotContext;
}): CopilotStep | string | null {
	const lower = text.toLowerCase();
	const selected = context.selectedClipIds;

	if (/\b(?:captions|subtitles|transcribe|transcript)\b/.test(lower)) {
		return { tool: "add_captions", language: "auto" };
	}
	if (/\bsilen(?:ce|ces|t)\b/.test(lower)) {
		return { tool: "remove_silences", minSilence: 0.6 };
	}
	const edge = lower.match(EDGE_PATTERN);
	if (edge) {
		const seconds = Math.min(Number(edge[2]), context.duration);
		if (seconds <= 0) return "The timeline is empty.";
		const range =
			edge[1] === "first"
				? { start: 0, end: seconds }
				: { start: context.duration - seconds, end: context.duration };
		return { tool: "remove_ranges", ranges: [range], reason: "request" };
	}
	const textMatch = text.match(TEXT_PATTERN);
	if (textMatch) {
		return { tool: "add_text", text: textMatch[1], start: context.playhead, duration: 3 };
	}
	if (/\b(?:split|cut)\b/.test(lower)) {
		return {
			tool: "split_clips",
			at: readTime({ text: lower, fallback: context.playhead }),
			clipIds: selected,
		};
	}
	if (/\b(?:delete|remove)\b/.test(lower)) {
		return selected.length > 0
			? { tool: "delete_clips", clipIds: selected }
			: "Select the clips to delete first.";
	}
	if (/\bmute\b/.test(lower)) {
		return selected.length > 0
			? { tool: "set_clip_param", clipIds: selected, param: "volume", value: -60 }
			: "Select the clips to mute first.";
	}
	for (const { param, pattern } of PARAM_PATTERNS) {
		const match = lower.match(pattern);
		if (!match) continue;
		return selected.length > 0
			? { tool: "set_clip_param", clipIds: selected, param, value: Number(match[1]) }
			: `Select the clips to change ${param} on first.`;
	}
	return null;
}

export function planFromDemo({
	request,
	context,
}: {
	request: string;
	context: CopilotContext;
}): CopilotPlan {
	const trimmed = request.trim();
	// A text request keeps its words; anything else may chain with "and"/"then".
	const parts = TEXT_PATTERN.test(trimmed)
		? [trimmed]
		: trimmed.split(/\s+(?:and|then)\s+|[,;]\s*/i).filter(Boolean);

	const steps: CopilotStep[] = [];
	const problems: string[] = [];
	for (const part of parts) {
		const result = planPart({ text: part, context });
		if (typeof result === "string") problems.push(result);
		else if (result) steps.push(result);
	}

	if (steps.length === 0) {
		return { message: problems[0] ?? DEMO_HELP, steps };
	}
	return {
		message: [
			"Here's the plan. Nothing changes until you apply it.",
			...problems,
		].join(" "),
		steps,
	};
}
