import { getElementParams, readElementParamValue } from "@/params/registry";
import type { SceneTracks, TimelineTrack } from "@/timeline";
import { getTrackLabels } from "@/timeline/components/track-labels";
import { DIAL_TARGETS } from "@/titanium-dial/targets";
import { mediaTimeToSeconds } from "@/wasm";
import type { CopilotParam } from "./steps";

/** One clip as the Copilot sees it. Times in seconds, values in display units. */
export interface CopilotClip {
	id: string;
	name: string;
	type: string;
	track: string;
	start: number;
	end: number;
	text?: string;
	values: Partial<Record<CopilotParam, number>>;
}

/** The timeline summary sent with every request. */
export interface CopilotContext {
	duration: number;
	playhead: number;
	selectedClipIds: string[];
	clips: CopilotClip[];
}

const round = (value: number) => Math.round(value * 100) / 100;

export function orderedTracks({ tracks }: { tracks: SceneTracks }): TimelineTrack[] {
	return [...tracks.overlay, tracks.main, ...tracks.audio];
}

export function buildCopilotContext({
	tracks,
	playhead,
	duration,
	selectedClipIds,
}: {
	tracks: SceneTracks;
	playhead: number;
	duration: number;
	selectedClipIds: string[];
}): CopilotContext {
	const ordered = orderedTracks({ tracks });
	const labels = getTrackLabels({ tracks: ordered });
	const clips: CopilotClip[] = [];
	for (const track of ordered) {
		for (const element of track.elements) {
			const params = getElementParams({ element });
			const values: CopilotClip["values"] = {};
			for (const target of DIAL_TARGETS) {
				const param = params.find((candidate) => candidate.key === target.paramKeys[0]);
				const value = param ? readElementParamValue({ element, param }) : null;
				if (typeof value === "number") values[target.id] = round(target.toDisplay(value));
			}
			const content = element.params.content;
			const start = mediaTimeToSeconds({ time: element.startTime });
			clips.push({
				id: element.id,
				name: element.name,
				type: element.type,
				track: labels.get(track.id)?.code ?? track.type,
				start: round(start),
				end: round(start + mediaTimeToSeconds({ time: element.duration })),
				...(typeof content === "string" ? { text: content } : {}),
				values,
			});
		}
	}
	return {
		duration: round(duration),
		playhead: round(playhead),
		selectedClipIds,
		clips,
	};
}
