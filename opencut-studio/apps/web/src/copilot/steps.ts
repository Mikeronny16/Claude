// A Copilot plan is a list of steps the user reviews before anything changes.
// Times are in seconds, parameter values in the units people use (percent,
// degrees, dB), matching the Titanium Dial.

import { LANGUAGES } from "@/transcription/languages";
import type { CaptionChunk, TranscriptionLanguage } from "@/transcription/types";
import { normalizeRanges, totalLength, type TimeRange } from "./silence";

export const COPILOT_PARAMS = ["opacity", "scale", "rotation", "volume"] as const;
export type CopilotParam = (typeof COPILOT_PARAMS)[number];

export type CopilotStep =
	| { tool: "split_clips"; at: number; clipIds: string[] }
	| { tool: "delete_clips"; clipIds: string[] }
	| { tool: "set_clip_param"; clipIds: string[]; param: CopilotParam; value: number }
	| { tool: "add_text"; text: string; start: number; duration: number }
	| { tool: "remove_ranges"; ranges: TimeRange[]; reason: "silence" | "request" }
	| { tool: "insert_captions"; captions: CaptionChunk[] }
	// Analysis steps: the panel turns these into the steps above (by
	// listening to the timeline) before the plan is shown.
	| { tool: "remove_silences"; minSilence: number }
	| { tool: "add_captions"; language: TranscriptionLanguage };

export interface CopilotPlan {
	/** What the Copilot says back, shown above the steps. */
	message: string;
	steps: CopilotStep[];
}

/** What the Copilot knows about the clips, for naming them in step text. */
export interface CopilotClipRef {
	id: string;
	name: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);
const isFiniteNumber = (value: unknown): value is number =>
	typeof value === "number" && Number.isFinite(value);
const stringList = (value: unknown): string[] | null =>
	Array.isArray(value) && value.every((item) => typeof item === "string")
		? value
		: null;

/**
 * Turns a tool call (from Claude or the demo planner) into a step, or null
 * when its input doesn't have the right shape.
 */
export function parseCopilotStep({
	tool,
	input,
}: {
	tool: string;
	input: unknown;
}): CopilotStep | null {
	if (!isRecord(input)) return null;
	switch (tool) {
		case "split_clips": {
			const clipIds = stringList(input.clip_ids ?? []);
			return isFiniteNumber(input.at) && input.at >= 0 && clipIds
				? { tool, at: input.at, clipIds }
				: null;
		}
		case "delete_clips": {
			const clipIds = stringList(input.clip_ids);
			return clipIds && clipIds.length > 0 ? { tool, clipIds } : null;
		}
		case "set_clip_param": {
			const clipIds = stringList(input.clip_ids);
			const param = COPILOT_PARAMS.find((name) => name === input.param);
			return clipIds && clipIds.length > 0 && param && isFiniteNumber(input.value)
				? { tool, clipIds, param, value: input.value }
				: null;
		}
		case "add_text": {
			const text = typeof input.text === "string" ? input.text.trim() : "";
			return text &&
				isFiniteNumber(input.start) &&
				input.start >= 0 &&
				isFiniteNumber(input.duration) &&
				input.duration > 0
				? { tool, text, start: input.start, duration: input.duration }
				: null;
		}
		case "remove_time_ranges": {
			if (!Array.isArray(input.ranges)) return null;
			const ranges = input.ranges.flatMap((range) =>
				isRecord(range) && isFiniteNumber(range.start) && isFiniteNumber(range.end)
					? [{ start: range.start, end: range.end }]
					: [],
			);
			const isValid =
				ranges.length > 0 &&
				ranges.length === input.ranges.length &&
				ranges.every((range) => range.start >= 0 && range.end > range.start);
			return isValid
				? { tool: "remove_ranges", ranges: normalizeRanges({ ranges }), reason: "request" }
				: null;
		}
		case "remove_silences": {
			const minSilence = isFiniteNumber(input.min_silence) ? input.min_silence : 0.6;
			return { tool, minSilence: Math.min(5, Math.max(0.2, minSilence)) };
		}
		case "add_captions": {
			const language = LANGUAGES.find((entry) => entry.code === input.language)?.code;
			return { tool, language: language ?? "auto" };
		}
		default:
			return null;
	}
}

export function formatSeconds(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const rest = seconds - minutes * 60;
	return `${minutes}:${rest.toFixed(1).padStart(4, "0")}`;
}

const PARAM_UNITS: Record<CopilotParam, string> = {
	opacity: "%",
	scale: "%",
	rotation: "°",
	volume: " dB",
};

function describeClips({
	clipIds,
	clips,
}: {
	clipIds: string[];
	clips: readonly CopilotClipRef[];
}): string {
	if (clipIds.length === 1) {
		const name = clips.find((clip) => clip.id === clipIds[0])?.name;
		return name ? `“${name}”` : "1 clip";
	}
	return `${clipIds.length} clips`;
}

/** One line a person can check before applying, e.g. "Split 2 clips at 0:04.0". */
export function describeCopilotStep({
	step,
	clips,
}: {
	step: CopilotStep;
	clips: readonly CopilotClipRef[];
}): string {
	switch (step.tool) {
		case "split_clips":
			return step.clipIds.length === 0
				? `Split every clip under ${formatSeconds(step.at)}`
				: `Split ${describeClips({ clipIds: step.clipIds, clips })} at ${formatSeconds(step.at)}`;
		case "delete_clips":
			return `Delete ${describeClips({ clipIds: step.clipIds, clips })}`;
		case "set_clip_param":
			return `Set ${step.param} of ${describeClips({ clipIds: step.clipIds, clips })} to ${step.value}${PARAM_UNITS[step.param]}`;
		case "add_text":
			return `Add text “${step.text}” at ${formatSeconds(step.start)} for ${step.duration} s`;
		case "remove_ranges": {
			const total = totalLength({ ranges: step.ranges }).toFixed(1);
			const [first] = step.ranges;
			if (step.reason === "silence") {
				const parts = step.ranges.length === 1 ? "silent part" : "silent parts";
				return `Remove ${step.ranges.length} ${parts} (${total} s in total)`;
			}
			return step.ranges.length === 1 && first
				? `Remove ${formatSeconds(first.start)}–${formatSeconds(first.end)} and close the gap`
				: `Remove ${step.ranges.length} parts (${total} s in total)`;
		}
		case "insert_captions":
			return `Add ${step.captions.length} ${step.captions.length === 1 ? "caption" : "captions"} on a new text track`;
		case "remove_silences":
			return `Remove silences longer than ${step.minSilence} s`;
		case "add_captions": {
			const name = LANGUAGES.find((entry) => entry.code === step.language)?.name;
			return name ? `Add captions (${name})` : "Add captions";
		}
	}
}
