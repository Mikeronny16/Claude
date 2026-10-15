import type Anthropic from "@anthropic-ai/sdk";
import { parseCopilotStep, type CopilotPlan } from "./steps";

// Server-side half of the Claude Copilot: the model, its instructions and
// the editing tools it may call. Its tool calls become a plan the user
// reviews; they are not run until the user applies them.

export const COPILOT_MODEL = "claude-opus-4-8";

export const COPILOT_SYSTEM_PROMPT = `You are the Copilot inside OpenCut Studio, a desktop video editor. The user asks for edits in plain language, in English or Burmese.

Each request comes with a JSON summary of the timeline: every clip's id, name, type, track code (V1 is the main video track, V2 and up are video overlays above it, T text, G graphics, FX effects, A audio), start and end in seconds, and current values (opacity %, scale %, rotation °, volume dB), plus the playhead time and the selected clip ids.

Plan the edit by calling the tools, in the order they should run. Your tool calls are shown to the user as a plan and run only if they approve it, so make every call the edit needs in this one reply; you will not see tool results. Use only clip ids from the summary. Splitting keeps a clip's id on its left part, and the new right part can't be referred to in the same plan. "This", "it" or "selected" means the selected clips.

If the request is unclear or needs something these tools can't do (for example removing silences, adding music, captions or exporting), don't call any tool; say briefly what you can do instead. Reply in the user's language, in one or two short sentences.`;

const clipIds = {
	type: "array",
	items: { type: "string" },
	description: "Ids of clips from the timeline summary.",
} as const;

export const COPILOT_TOOLS: Anthropic.Tool[] = [
	{
		name: "split_clips",
		description:
			"Split clips into two at a time. With an empty clip_ids list, splits every clip under that time.",
		strict: true,
		input_schema: {
			type: "object",
			properties: {
				at: { type: "number", description: "Timeline time in seconds." },
				clip_ids: clipIds,
			},
			required: ["at", "clip_ids"],
			additionalProperties: false,
		},
	},
	{
		name: "delete_clips",
		description: "Delete clips from the timeline.",
		strict: true,
		input_schema: {
			type: "object",
			properties: { clip_ids: clipIds },
			required: ["clip_ids"],
			additionalProperties: false,
		},
	},
	{
		name: "set_clip_param",
		description:
			"Set a value on clips: opacity 0-100 (%), scale 1-400 (%), rotation -360 to 360 (degrees), volume -60 to 20 (dB). Video, image, text and graphic clips have opacity, scale and rotation; video and audio clips have volume.",
		strict: true,
		input_schema: {
			type: "object",
			properties: {
				clip_ids: clipIds,
				param: { type: "string", enum: ["opacity", "scale", "rotation", "volume"] },
				value: { type: "number" },
			},
			required: ["clip_ids", "param", "value"],
			additionalProperties: false,
		},
	},
	{
		name: "add_text",
		description: "Add a text clip (a title or caption) to the timeline.",
		strict: true,
		input_schema: {
			type: "object",
			properties: {
				text: { type: "string" },
				start: { type: "number", description: "Start time in seconds." },
				duration: { type: "number", description: "Length in seconds." },
			},
			required: ["text", "start", "duration"],
			additionalProperties: false,
		},
	},
];

/** Turns Claude's reply into a plan: its text is the message, its tool calls the steps. */
export function planFromClaudeContent({
	content,
}: {
	content: Anthropic.Message["content"];
}): CopilotPlan {
	const text: string[] = [];
	const steps: CopilotPlan["steps"] = [];
	let invalid = 0;
	for (const block of content) {
		if (block.type === "text") {
			text.push(block.text.trim());
		} else if (block.type === "tool_use") {
			const step = parseCopilotStep({ tool: block.name, input: block.input });
			if (step) steps.push(step);
			else invalid += 1;
		}
	}
	const notes = invalid > 0 ? [`(${invalid} step${invalid > 1 ? "s" : ""} couldn't be used.)`] : [];
	const message = [...text.filter(Boolean), ...notes].join(" ");
	return {
		message:
			message ||
			(steps.length > 0
				? "Here's the plan. Nothing changes until you apply it."
				: "I couldn't make a plan for that."),
		steps,
	};
}
