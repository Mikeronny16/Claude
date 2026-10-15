// Geometry of the Titanium Dial. Angles are in degrees, 0 at the top and
// increasing clockwise; the dial sweeps 270°, leaving a gap at the bottom.

export const DIAL_SWEEP_DEGREES = 270;
const HALF_SWEEP = DIAL_SWEEP_DEGREES / 2;

function clamp({ value, min, max }: { value: number; min: number; max: number }) {
	return Math.min(max, Math.max(min, value));
}

function decimalsOf({ step }: { step: number }): number {
	const text = String(step);
	const dot = text.indexOf(".");
	return dot === -1 ? 0 : text.length - dot - 1;
}

/** Clamps to [min, max] and rounds to the nearest step counted from min. */
export function snapDialValue({
	value,
	min,
	max,
	step,
}: {
	value: number;
	min: number;
	max: number;
	step: number;
}): number {
	const snapped = min + Math.round((value - min) / step) * step;
	return Number(
		clamp({ value: snapped, min, max }).toFixed(decimalsOf({ step })),
	);
}

export function valueToAngle({
	value,
	min,
	max,
}: {
	value: number;
	min: number;
	max: number;
}): number {
	if (max <= min) return -HALF_SWEEP;
	const ratio = clamp({ value: (value - min) / (max - min), min: 0, max: 1 });
	return -HALF_SWEEP + ratio * DIAL_SWEEP_DEGREES;
}

export function angleToValue({
	angle,
	min,
	max,
	step,
}: {
	angle: number;
	min: number;
	max: number;
	step: number;
}): number {
	const ratio = (clamp({ value: angle, min: -HALF_SWEEP, max: HALF_SWEEP }) + HALF_SWEEP) /
		DIAL_SWEEP_DEGREES;
	return snapDialValue({ value: min + ratio * (max - min), min, max, step });
}

/**
 * Angle of a pointer around the dial's centre, limited to the sweep: a
 * pointer in the bottom gap goes to the nearer end.
 */
export function pointerToAngle({
	x,
	y,
	centerX,
	centerY,
}: {
	x: number;
	y: number;
	centerX: number;
	centerY: number;
}): number {
	const angle = (Math.atan2(x - centerX, centerY - y) * 180) / Math.PI;
	return clamp({ value: angle, min: -HALF_SWEEP, max: HALF_SWEEP });
}

/** Point on a circle of the dial, for drawing (SVG coordinates). */
export function polarPoint({
	angle,
	radius,
	center,
}: {
	angle: number;
	radius: number;
	center: number;
}): { x: number; y: number } {
	const radians = (angle * Math.PI) / 180;
	return {
		x: center + radius * Math.sin(radians),
		y: center - radius * Math.cos(radians),
	};
}

/** SVG path for a clockwise arc between two dial angles. */
export function arcPath({
	from,
	to,
	radius,
	center,
}: {
	from: number;
	to: number;
	radius: number;
	center: number;
}): string {
	const start = Math.min(from, to);
	const end = Math.max(from, to);
	const a = polarPoint({ angle: start, radius, center });
	const b = polarPoint({ angle: end, radius, center });
	const largeArc = end - start > 180 ? 1 : 0;
	return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${largeArc} 1 ${b.x} ${b.y}`;
}
