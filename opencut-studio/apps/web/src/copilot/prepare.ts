import type { EditorCore } from "@/core";
import { decodeAudioToFloat32, timelineHasAudio } from "@/media/audio";
import { extractTimelineAudio } from "@/media/mediabunny";
import { transcriptionService } from "@/services/transcription/service";
import { DEFAULT_TRANSCRIPTION_SAMPLE_RATE } from "@/transcription/audio";
import { buildCaptionChunks } from "@/transcription/caption";
import { mediaTimeToSeconds } from "@/wasm";
import {
	detectSilences,
	mapSpanThroughRemovals,
	normalizeRanges,
	totalLength,
	type TimeRange,
} from "./silence";
import type { CopilotStep } from "./steps";

// Removing more than this share of the timeline as "silence" is more likely
// a quiet recording than pauses, so the Copilot stops and says so.
const MAX_SILENT_SHARE = 0.8;

/**
 * Turns analysis steps into concrete ones by listening to the timeline:
 * remove_silences → remove_ranges, add_captions → insert_captions. Runs
 * before the plan is shown, so the user reviews real times and text.
 */
export async function prepareCopilotSteps({
	editor,
	steps,
	onProgress,
}: {
	editor: EditorCore;
	steps: CopilotStep[];
	onProgress: (status: string) => void;
}): Promise<{ steps: CopilotStep[]; notes: string[] }> {
	const tracks = editor.scenes.getActiveScene().tracks;
	const mediaAssets = editor.media.getAssets();
	const totalDuration = editor.timeline.getTotalDuration();
	const durationSeconds = mediaTimeToSeconds({ time: totalDuration });
	const hasAudio = timelineHasAudio({ tracks, mediaAssets });

	let samples: Float32Array | null = null;
	const timelineSamples = async () => {
		if (samples) return samples;
		onProgress("Listening to the timeline…");
		const audioBlob = await extractTimelineAudio({ tracks, mediaAssets, totalDuration });
		samples = (
			await decodeAudioToFloat32({ audioBlob, sampleRate: DEFAULT_TRANSCRIPTION_SAMPLE_RATE })
		).samples;
		return samples;
	};

	const prepared: CopilotStep[] = [];
	const notes: string[] = [];
	// Time already cut by earlier steps, so later captions line up.
	const removed: TimeRange[] = [];

	for (const step of steps) {
		if (step.tool === "remove_silences") {
			if (!hasAudio) {
				notes.push("The timeline has no audio to listen to.");
				continue;
			}
			const ranges = detectSilences({
				samples: await timelineSamples(),
				sampleRate: DEFAULT_TRANSCRIPTION_SAMPLE_RATE,
				minSilence: step.minSilence,
			});
			if (ranges.length === 0) {
				notes.push("No silences long enough to remove.");
			} else if (totalLength({ ranges }) > durationSeconds * MAX_SILENT_SHARE) {
				notes.push("Almost everything is silent, so nothing was removed. Check the audio.");
			} else {
				removed.push(...ranges);
				prepared.push({ tool: "remove_ranges", ranges, reason: "silence" });
			}
		} else if (step.tool === "add_captions") {
			if (!hasAudio) {
				notes.push("The timeline has no audio to caption.");
				continue;
			}
			const audioData = await timelineSamples();
			const result = await transcriptionService.transcribe({
				audioData,
				language: step.language,
				onProgress: (progress) =>
					onProgress(
						progress.status === "loading-model"
							? `Loading the speech model… ${Math.round(progress.progress)}%`
							: "Transcribing…",
					),
			});
			const cuts = normalizeRanges({ ranges: removed });
			const captions = buildCaptionChunks({ segments: result.segments }).flatMap((chunk) => {
				const span = mapSpanThroughRemovals({
					span: { start: chunk.startTime, end: chunk.startTime + chunk.duration },
					removed: cuts,
				});
				return span ? [{ ...chunk, startTime: span.start, duration: span.end - span.start }] : [];
			});
			if (captions.length === 0) notes.push("No speech was found for captions.");
			else prepared.push({ tool: "insert_captions", captions });
		} else {
			if (step.tool === "remove_ranges") removed.push(...step.ranges);
			prepared.push(step);
		}
	}
	return { steps: prepared, notes };
}
