import { describe, expect, test } from "bun:test";
import type { CopilotContext } from "../context";
import { DEMO_HELP, planFromDemo } from "../demo-planner";
import { describeCopilotStep, formatSeconds, parseCopilotStep } from "../steps";

const context: CopilotContext = {
	duration: 12,
	playhead: 4,
	selectedClipIds: ["clip-a"],
	clips: [
		{ id: "clip-a", name: "intro.mp4", type: "video", track: "V1", start: 0, end: 6, values: { opacity: 100 } },
		{ id: "clip-b", name: "outro.mp4", type: "video", track: "V1", start: 6, end: 12, values: { opacity: 100 } },
	],
};

describe("parseCopilotStep", () => {
	test("accepts well-formed tool calls", () => {
		expect(parseCopilotStep({ tool: "split_clips", input: { at: 2.5, clip_ids: ["a"] } })).toEqual({
			tool: "split_clips",
			at: 2.5,
			clipIds: ["a"],
		});
		expect(parseCopilotStep({ tool: "split_clips", input: { at: 1 } })).toEqual({
			tool: "split_clips",
			at: 1,
			clipIds: [],
		});
		expect(
			parseCopilotStep({ tool: "set_clip_param", input: { clip_ids: ["a"], param: "volume", value: -6 } }),
		).toEqual({ tool: "set_clip_param", clipIds: ["a"], param: "volume", value: -6 });
		expect(
			parseCopilotStep({ tool: "add_text", input: { text: " Hello ", start: 0, duration: 2 } }),
		).toEqual({ tool: "add_text", text: "Hello", start: 0, duration: 2 });
	});

	test("rejects malformed or unknown tool calls", () => {
		expect(parseCopilotStep({ tool: "split_clips", input: { at: -1 } })).toBeNull();
		expect(parseCopilotStep({ tool: "delete_clips", input: { clip_ids: [] } })).toBeNull();
		expect(
			parseCopilotStep({ tool: "set_clip_param", input: { clip_ids: ["a"], param: "speed", value: 2 } }),
		).toBeNull();
		expect(parseCopilotStep({ tool: "add_text", input: { text: "", start: 0, duration: 2 } })).toBeNull();
		expect(parseCopilotStep({ tool: "format_disk", input: {} })).toBeNull();
		expect(parseCopilotStep({ tool: "delete_clips", input: "everything" })).toBeNull();
	});
});

describe("describeCopilotStep", () => {
	test("names clips and units", () => {
		const clips = context.clips;
		expect(describeCopilotStep({ step: { tool: "delete_clips", clipIds: ["clip-b"] }, clips })).toBe(
			"Delete “outro.mp4”",
		);
		expect(
			describeCopilotStep({
				step: { tool: "set_clip_param", clipIds: ["clip-a", "clip-b"], param: "opacity", value: 50 },
				clips,
			}),
		).toBe("Set opacity of 2 clips to 50%");
		expect(describeCopilotStep({ step: { tool: "split_clips", at: 65.25, clipIds: [] }, clips })).toBe(
			"Split every clip under 1:05.3",
		);
		expect(formatSeconds(4)).toBe("0:04.0");
	});
});

describe("planFromDemo", () => {
	test("plans simple commands on the selection", () => {
		expect(planFromDemo({ request: "opacity 50%", context }).steps).toEqual([
			{ tool: "set_clip_param", clipIds: ["clip-a"], param: "opacity", value: 50 },
		]);
		expect(planFromDemo({ request: "Rotate -15 degrees", context }).steps).toEqual([
			{ tool: "set_clip_param", clipIds: ["clip-a"], param: "rotation", value: -15 },
		]);
		expect(planFromDemo({ request: "volume -6 dB", context }).steps[0]).toMatchObject({
			param: "volume",
			value: -6,
		});
	});

	test("splits at the playhead or a given time, and chains with and/then", () => {
		expect(planFromDemo({ request: "split at playhead and delete selected", context }).steps).toEqual([
			{ tool: "split_clips", at: 4, clipIds: ["clip-a"] },
			{ tool: "delete_clips", clipIds: ["clip-a"] },
		]);
		expect(planFromDemo({ request: "cut at 1:05", context }).steps[0]).toMatchObject({ at: 65 });
	});

	test("keeps the words of a title, even with 'and' in it", () => {
		expect(planFromDemo({ request: "add title Salt and Pepper", context }).steps).toEqual([
			{ tool: "add_text", text: "Salt and Pepper", start: 4, duration: 3 },
		]);
	});

	test("explains what it needs or what it understands", () => {
		const noSelection = { ...context, selectedClipIds: [] };
		expect(planFromDemo({ request: "delete selected", context: noSelection })).toEqual({
			message: "Select the clips to delete first.",
			steps: [],
		});
		expect(planFromDemo({ request: "make it cinematic", context })).toEqual({
			message: DEMO_HELP,
			steps: [],
		});
	});
});

describe("planFromClaudeContent", () => {
	test("uses text as the message and valid tool calls as steps", async () => {
		const { planFromClaudeContent } = await import("../claude");
		const content = [
			{ type: "thinking", thinking: "", signature: "x" },
			{ type: "text", text: "I'll fade the intro.", citations: null },
			{ type: "tool_use", id: "t1", name: "set_clip_param", input: { clip_ids: ["clip-a"], param: "opacity", value: 40 } },
			{ type: "tool_use", id: "t2", name: "set_clip_param", input: { clip_ids: ["clip-a"], param: "speed", value: 2 } },
		] as unknown as Parameters<typeof planFromClaudeContent>[0]["content"];
		expect(planFromClaudeContent({ content })).toEqual({
			message: "I'll fade the intro. (1 step couldn't be used.)",
			steps: [{ tool: "set_clip_param", clipIds: ["clip-a"], param: "opacity", value: 40 }],
		});
	});

	test("explains when there is nothing to do", async () => {
		const { planFromClaudeContent } = await import("../claude");
		expect(planFromClaudeContent({ content: [] }).message).toBe("I couldn't make a plan for that.");
	});
});
