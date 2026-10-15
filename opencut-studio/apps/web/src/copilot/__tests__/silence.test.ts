import { describe, expect, test } from "bun:test";
import type { CopilotContext } from "../context";
import { planFromDemo } from "../demo-planner";
import { detectSilences, mapSpanThroughRemovals, normalizeRanges } from "../silence";
import { describeCopilotStep, parseCopilotStep } from "../steps";

const RATE = 1000;

/** Tone and silence segments, e.g. [["tone", 1], ["silence", 2]]. */
function audio(parts: Array<["tone" | "silence", number]>): Float32Array {
	const total = parts.reduce((sum, [, seconds]) => sum + seconds, 0);
	const samples = new Float32Array(Math.round(total * RATE));
	let offset = 0;
	for (const [kind, seconds] of parts) {
		const count = Math.round(seconds * RATE);
		for (let index = 0; index < count; index++) {
			samples[offset + index] = kind === "tone" ? 0.3 * Math.sin(index / 3) : 0.0005 * Math.sin(index);
		}
		offset += count;
	}
	return samples;
}

describe("detectSilences", () => {
	test("finds pauses longer than the minimum, keeping a breath on each side", () => {
		const ranges = detectSilences({
			samples: audio([["tone", 1], ["silence", 2], ["tone", 1], ["silence", 0.3], ["tone", 1]]),
			sampleRate: RATE,
		});
		expect(ranges).toHaveLength(1);
		expect(ranges[0].start).toBeCloseTo(1.15, 2);
		expect(ranges[0].end).toBeCloseTo(2.85, 2);
	});

	test("finds trailing silence and nothing in continuous sound", () => {
		expect(detectSilences({ samples: audio([["tone", 1], ["silence", 1]]), sampleRate: RATE })).toHaveLength(1);
		expect(detectSilences({ samples: audio([["tone", 3]]), sampleRate: RATE })).toEqual([]);
	});
});

describe("range arithmetic", () => {
	test("normalizes and merges ranges", () => {
		expect(normalizeRanges({ ranges: [{ start: 5, end: 6 }, { start: 1, end: 3 }, { start: 2, end: 4 }, { start: 7, end: 7 }] })).toEqual([
			{ start: 1, end: 4 },
			{ start: 5, end: 6 },
		]);
	});

	test("moves spans earlier past removed time and drops spans that vanish", () => {
		const removed = [{ start: 1, end: 3 }];
		expect(mapSpanThroughRemovals({ span: { start: 4, end: 5 }, removed })).toEqual({ start: 2, end: 3 });
		expect(mapSpanThroughRemovals({ span: { start: 0.5, end: 2 }, removed })).toEqual({ start: 0.5, end: 1 });
		expect(mapSpanThroughRemovals({ span: { start: 1.5, end: 2.5 }, removed })).toBeNull();
	});
});

describe("silence and caption steps", () => {
	const context: CopilotContext = { duration: 10, playhead: 0, selectedClipIds: [], clips: [] };

	test("demo mode plans silences, captions and edge cuts", () => {
		expect(planFromDemo({ request: "remove silences and add captions", context }).steps).toEqual([
			{ tool: "remove_silences", minSilence: 0.6 },
			{ tool: "add_captions", language: "auto" },
		]);
		expect(planFromDemo({ request: "cut the first 2 seconds", context }).steps).toEqual([
			{ tool: "remove_ranges", ranges: [{ start: 0, end: 2 }], reason: "request" },
		]);
		expect(planFromDemo({ request: "trim the last 3s", context }).steps).toEqual([
			{ tool: "remove_ranges", ranges: [{ start: 7, end: 10 }], reason: "request" },
		]);
	});

	test("Claude's tools parse into steps", () => {
		expect(
			parseCopilotStep({
				tool: "remove_time_ranges",
				input: { ranges: [{ start: 4, end: 6 }, { start: 0, end: 2 }, { start: 5, end: 7 }] },
			}),
		).toEqual({
			tool: "remove_ranges",
			ranges: [{ start: 0, end: 2 }, { start: 4, end: 7 }],
			reason: "request",
		});
		expect(parseCopilotStep({ tool: "remove_time_ranges", input: { ranges: [{ start: 3, end: 1 }] } })).toBeNull();
		expect(parseCopilotStep({ tool: "remove_silences", input: { min_silence: 9 } })).toEqual({
			tool: "remove_silences",
			minSilence: 5,
		});
		expect(parseCopilotStep({ tool: "add_captions", input: { language: "klingon" } })).toEqual({
			tool: "add_captions",
			language: "auto",
		});
	});

	test("describes the prepared steps", () => {
		expect(
			describeCopilotStep({
				step: { tool: "remove_ranges", ranges: [{ start: 1, end: 2.5 }, { start: 4, end: 5 }], reason: "silence" },
				clips: [],
			}),
		).toBe("Remove 2 silent parts (2.5 s in total)");
		expect(
			describeCopilotStep({ step: { tool: "remove_ranges", ranges: [{ start: 0, end: 2 }], reason: "request" }, clips: [] }),
		).toBe("Remove 0:00.0–0:02.0 and close the gap");
		expect(
			describeCopilotStep({
				step: { tool: "insert_captions", captions: [{ text: "Hi", startTime: 0, duration: 1 }] },
				clips: [],
			}),
		).toBe("Add 1 caption on a new text track");
	});
});
