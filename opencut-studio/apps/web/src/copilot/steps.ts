// A Copilot plan is a list of steps the user reviews before anything changes.
// Times are in seconds, parameter values in the units people use (percent,
// degrees, dB), matching the Titanium Dial.

export const COPILOT_PARAMS = ["opacity", "scale", "rotation", "volume"] as const;
export type CopilotParam = (typeof COPILOT_PARAMS)[number];

export type CopilotStep =
	| { tool: "split_clips"; at: number; clipIds: string[] }
	| { tool: "delete_clips"; clipIds: string[] }
	| { tool: "set_clip_param"; clipIds: string[]; param: CopilotParam; value: number }
	| { tool: "add_text"; text: string; start: number; duration: number };

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
	}
}
