import type { TimelineTrack, TrackType } from "@/timeline";

export interface TrackLabel {
	/** Short code, e.g. "V1". */
	code: string;
	/** Readable name, e.g. "Video 1". */
	name: string;
}

const TRACK_KINDS: Record<TrackType, { code: string; name: string }> = {
	video: { code: "V", name: "Video" },
	text: { code: "T", name: "Text" },
	graphic: { code: "G", name: "Graphics" },
	effect: { code: "FX", name: "Effects" },
	audio: { code: "A", name: "Audio" },
};

/**
 * Editor-style track labels. Picture layers count up from the bottom, so the
 * main track is V1 and overlays above it are V2, V3…; audio counts down from
 * the top, so A1 sits next to the picture.
 */
export function getTrackLabels({
	tracks,
}: {
	tracks: readonly Pick<TimelineTrack, "id" | "type">[];
}): Map<string, TrackLabel> {
	const pictureBottomUp = [...tracks].reverse().filter((track) => track.type !== "audio");
	const audioTopDown = tracks.filter((track) => track.type === "audio");
	const counts = new Map<TrackType, number>();
	const labels = new Map<string, TrackLabel>();
	for (const track of [...pictureBottomUp, ...audioTopDown]) {
		const number = (counts.get(track.type) ?? 0) + 1;
		counts.set(track.type, number);
		const kind = TRACK_KINDS[track.type];
		labels.set(track.id, {
			code: `${kind.code}${number}`,
			name: `${kind.name} ${number}`,
		});
	}
	return labels;
}
