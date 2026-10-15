// Silence detection on the timeline's mixed audio, and time arithmetic for
// removing ranges. Times are in seconds on the timeline.

export interface TimeRange {
	start: number;
	end: number;
}

/**
 * Quiet stretches of at least `minSilence` seconds, each shrunk by `padding`
 * on both sides so speech keeps a natural breath around it.
 */
export function detectSilences({
	samples,
	sampleRate,
	thresholdDb = -40,
	minSilence = 0.6,
	padding = 0.15,
	windowSeconds = 0.02,
}: {
	samples: Float32Array;
	sampleRate: number;
	thresholdDb?: number;
	minSilence?: number;
	padding?: number;
	windowSeconds?: number;
}): TimeRange[] {
	const window = Math.max(1, Math.round(sampleRate * windowSeconds));
	const windowCount = Math.floor(samples.length / window);
	const ranges: TimeRange[] = [];
	let runStart: number | null = null;

	const closeRun = (endWindow: number) => {
		if (runStart === null) return;
		const start = (runStart * window) / sampleRate;
		const end = (endWindow * window) / sampleRate;
		if (end - start >= minSilence && end - start > 2 * padding) {
			ranges.push({ start: start + padding, end: end - padding });
		}
		runStart = null;
	};

	for (let index = 0; index < windowCount; index++) {
		let sum = 0;
		for (let sample = index * window; sample < (index + 1) * window; sample++) {
			sum += samples[sample] * samples[sample];
		}
		const db = 20 * Math.log10(Math.sqrt(sum / window) + 1e-12);
		if (db < thresholdDb) {
			runStart ??= index;
		} else {
			closeRun(index);
		}
	}
	closeRun(windowCount);
	return ranges;
}

/** Sorted, merged, non-empty ranges. */
export function normalizeRanges({ ranges }: { ranges: readonly TimeRange[] }): TimeRange[] {
	const sorted = ranges
		.filter((range) => range.end > range.start)
		.map((range) => ({ start: Math.max(0, range.start), end: range.end }))
		.sort((a, b) => a.start - b.start);
	const merged: TimeRange[] = [];
	for (const range of sorted) {
		const last = merged.at(-1);
		if (last && range.start <= last.end) last.end = Math.max(last.end, range.end);
		else merged.push({ ...range });
	}
	return merged;
}

export function totalLength({ ranges }: { ranges: readonly TimeRange[] }): number {
	return ranges.reduce((sum, range) => sum + (range.end - range.start), 0);
}

/**
 * Where a span lands once `removed` ranges are cut out and the rest closes
 * up; null when nothing of it is left.
 */
export function mapSpanThroughRemovals({
	span,
	removed,
}: {
	span: TimeRange;
	removed: readonly TimeRange[];
}): TimeRange | null {
	const shiftBefore = (time: number) =>
		removed.reduce(
			(shift, range) =>
				shift + Math.max(0, Math.min(time, range.end) - range.start),
			0,
		);
	const start = span.start - shiftBefore(span.start);
	const end = span.end - shiftBefore(span.end);
	return end - start > 0.05 ? { start, end } : null;
}
