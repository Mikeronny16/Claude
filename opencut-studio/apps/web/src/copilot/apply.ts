import { hasKeyframesForPath } from "@/animation";
import {
	DeleteElementsCommand,
	InsertElementCommand,
	SplitElementsCommand,
	TracksSnapshotCommand,
	UpdateElementsCommand,
} from "@/commands/timeline";
import type { EditorCore } from "@/core";
import { getElementParams, writeElementParamValue } from "@/params/registry";
import type { SceneTracks, TimelineElement } from "@/timeline";
import { DEFAULTS } from "@/timeline/defaults";
import { buildTextElement } from "@/timeline/element-utils";
import { DIAL_TARGETS } from "@/titanium-dial/targets";
import { buildCaptionTrackCommand } from "@/subtitles/insert";
import { mediaTimeFromSeconds, mediaTimeToSeconds, subMediaTime } from "@/wasm";
import { orderedTracks } from "./context";
import { normalizeRanges, type TimeRange } from "./silence";
import type { CopilotStep } from "./steps";

// Tolerance for comparing clip edges, in seconds (well under one frame).
const EDGE_EPSILON = 1e-4;

type Located = { trackId: string; element: TimelineElement };

function locateClips({ editor }: { editor: EditorCore }): Map<string, Located> {
	const located = new Map<string, Located>();
	for (const track of orderedTracks({ tracks: editor.scenes.getActiveScene().tracks })) {
		for (const element of track.elements) {
			located.set(element.id, { trackId: track.id, element });
		}
	}
	return located;
}

function refs({ clipIds, clips }: { clipIds: string[]; clips: Map<string, Located> }) {
	return clipIds.flatMap((id) => {
		const clip = clips.get(id);
		return clip ? [{ trackId: clip.trackId, elementId: id }] : [];
	});
}

function clipSpans({ editor }: { editor: EditorCore }) {
	return [...locateClips({ editor }).values()].map(({ trackId, element }) => {
		const start = mediaTimeToSeconds({ time: element.startTime });
		return {
			trackId,
			element,
			start,
			end: start + mediaTimeToSeconds({ time: element.duration }),
		};
	});
}

/**
 * Cuts a time range out of every track: splits clips at its edges, deletes
 * what is inside, and moves everything after it earlier to close the gap.
 */
function removeRange({ editor, range }: { editor: EditorCore; range: TimeRange }) {
	const startTime = mediaTimeFromSeconds({ seconds: range.start });
	const endTime = mediaTimeFromSeconds({ seconds: range.end });
	const toRef = ({ trackId, element }: { trackId: string; element: TimelineElement }) => ({
		trackId,
		elementId: element.id,
	});
	for (const [seconds, time] of [
		[range.end, endTime],
		[range.start, startTime],
	] as const) {
		const crossing = clipSpans({ editor }).filter(
			(clip) => clip.start < seconds - EDGE_EPSILON && clip.end > seconds + EDGE_EPSILON,
		);
		if (crossing.length > 0) {
			new SplitElementsCommand({
				elements: crossing.map(toRef),
				splitTime: time,
				retainSide: "both",
			}).execute();
		}
	}
	const inside = clipSpans({ editor }).filter(
		(clip) => clip.start >= range.start - EDGE_EPSILON && clip.end <= range.end + EDGE_EPSILON,
	);
	if (inside.length > 0) {
		new DeleteElementsCommand({ elements: inside.map(toRef) }).execute();
	}
	const gap = subMediaTime({ a: endTime, b: startTime });
	const later = clipSpans({ editor }).filter((clip) => clip.start >= range.end - EDGE_EPSILON);
	if (later.length > 0) {
		new UpdateElementsCommand({
			updates: later.map((clip) => ({
				...toRef(clip),
				patch: { startTime: subMediaTime({ a: clip.element.startTime, b: gap }) },
			})),
		}).execute();
	}
}

/** Runs one step on the live timeline without adding to the undo history. */
function runStep({ editor, step }: { editor: EditorCore; step: CopilotStep }): string | null {
	const clips = locateClips({ editor });
	switch (step.tool) {
		case "split_clips": {
			const ids =
				step.clipIds.length > 0
					? step.clipIds
					: [...clips.values()]
							.filter(({ element }) => {
								const start = mediaTimeToSeconds({ time: element.startTime });
								const end = start + mediaTimeToSeconds({ time: element.duration });
								return step.at > start && step.at < end;
							})
							.map(({ element }) => element.id);
			const elements = refs({ clipIds: ids, clips });
			if (elements.length === 0) return "Nothing to split there.";
			new SplitElementsCommand({
				elements,
				splitTime: mediaTimeFromSeconds({ seconds: step.at }),
				retainSide: "both",
			}).execute();
			return null;
		}
		case "delete_clips": {
			const elements = refs({ clipIds: step.clipIds, clips });
			if (elements.length === 0) return "Those clips are gone.";
			new DeleteElementsCommand({ elements }).execute();
			return null;
		}
		case "set_clip_param": {
			const target = DIAL_TARGETS.find((candidate) => candidate.id === step.param);
			if (!target) return `Unknown parameter ${step.param}.`;
			const value = target.fromDisplay(
				Math.min(target.max, Math.max(target.min, step.value)),
			);
			const updates = step.clipIds.flatMap((id) => {
				const clip = clips.get(id);
				if (!clip) return [];
				const available = getElementParams({ element: clip.element });
				const params = target.paramKeys.flatMap((key) =>
					available.filter((param) => param.key === key),
				);
				const isAnimated = target.paramKeys.some((key) =>
					hasKeyframesForPath({ animations: clip.element.animations, propertyPath: key }),
				);
				if (params.length !== target.paramKeys.length || isAnimated) return [];
				const updated = params.reduce(
					(element, param) => writeElementParamValue({ element, param, value }),
					clip.element,
				);
				return [{ trackId: clip.trackId, elementId: id, patch: { params: updated.params } }];
			});
			if (updates.length === 0) return `No selected clip has an editable ${step.param}.`;
			new UpdateElementsCommand({ updates }).execute();
			return null;
		}
		case "remove_ranges": {
			const ranges = normalizeRanges({ ranges: step.ranges });
			if (ranges.length === 0) return "Nothing to remove.";
			// Last range first, so earlier ranges keep their times.
			for (const range of [...ranges].reverse()) removeRange({ editor, range });
			return null;
		}
		case "insert_captions": {
			const built = buildCaptionTrackCommand({ editor, captions: step.captions });
			if (!built) return "No speech was found for captions.";
			built.command.execute();
			return null;
		}
		case "remove_silences":
		case "add_captions":
			return "This step wasn't prepared.";
		case "add_text": {
			const raw = DEFAULTS.text.element;
			new InsertElementCommand({
				element: buildTextElement({
					raw: {
						...raw,
						name: step.text,
						duration: mediaTimeFromSeconds({ seconds: step.duration }),
						params: { ...raw.params, content: step.text },
					},
					startTime: mediaTimeFromSeconds({ seconds: step.start }),
				}),
				placement: { mode: "auto" },
			}).execute();
			return null;
		}
	}
}

/**
 * Shows a plan on the real timeline before it is accepted. `start` runs the
 * steps with no undo entries; `commit` records the whole change as one undo
 * step; `discard` puts the timeline back exactly as it was.
 */
export class CopilotPreview {
	private before: SceneTracks | null = null;

	constructor(private editor: EditorCore) {}

	get isActive(): boolean {
		return this.before !== null;
	}

	start({ steps }: { steps: CopilotStep[] }): string[] {
		this.discard();
		this.before = this.editor.scenes.getActiveScene().tracks;
		this.editor.selection.clearSelection();
		return steps.flatMap((step) => {
			const problem = runStep({ editor: this.editor, step });
			return problem ? [problem] : [];
		});
	}

	commit(): void {
		if (!this.before) return;
		const after = this.editor.scenes.getActiveScene().tracks;
		this.editor.command.push({
			command: new TracksSnapshotCommand({ before: this.before, after }),
		});
		this.before = null;
	}

	discard(): void {
		if (!this.before) return;
		this.editor.timeline.updateTracks(this.before);
		this.before = null;
	}
}
