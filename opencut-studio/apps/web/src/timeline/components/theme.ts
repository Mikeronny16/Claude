import type { TrackType } from "@/timeline";

export const TIMELINE_AUDIO_WAVEFORM_COLOR = "rgba(255, 255, 255, 0.7)";

export const TIMELINE_TRACK_THEME: Record<
	TrackType,
	{
		elementClassName: string;
		waveformColor?: string;
	}
> = {
	// Restrained and told apart by hue; white labels stay above 5:1 and the
	// silver selection ring (--primary) stays visible on each.
	video: { elementClassName: "transparent" },
	text: { elementClassName: "bg-[#6553C9]" },
	audio: {
		elementClassName: "bg-[#2B7A5E]",
		waveformColor: TIMELINE_AUDIO_WAVEFORM_COLOR,
	},
	graphic: { elementClassName: "bg-[#9E4A6A]" },
	effect: { elementClassName: "bg-[#3D66A8]" },
} as const;

export const SELECTED_TRACK_ROW_CLASS = "bg-accent/50";
export const DEFAULT_TIMELINE_BOOKMARK_COLOR = "#E0E4E9";

export function getTimelineElementClassName({
	type,
}: {
	type: TrackType;
}): string {
	return TIMELINE_TRACK_THEME[type].elementClassName.trim();
}
