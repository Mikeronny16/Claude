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
import { mediaTimeFromSeconds, mediaTimeToSeconds } from "@/wasm";
import { orderedTracks } from "./context";
import type { CopilotStep } from "./steps";

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
