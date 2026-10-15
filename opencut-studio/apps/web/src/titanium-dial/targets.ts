import { VOLUME_DB_MAX, VOLUME_DB_MIN } from "@/timeline/audio-constants";

export type DialTargetId = "opacity" | "scale" | "rotation" | "volume";

/**
 * A parameter the Titanium Dial can turn. Values on the dial are in display
 * units (percent, degrees, dB); `paramKeys` are the element params written,
 * all with the same value (scale sets X and Y together).
 */
export interface DialTarget {
	id: DialTargetId;
	label: string;
	unit: string;
	paramKeys: readonly string[];
	min: number;
	max: number;
	step: number;
	/** Where the lit arc starts: the neutral value. */
	origin: number;
	toDisplay: (paramValue: number) => number;
	fromDisplay: (displayValue: number) => number;
	format: (displayValue: number) => string;
}

const asIs = (value: number) => value;

export const DIAL_TARGETS: readonly DialTarget[] = [
	{
		id: "opacity",
		label: "Opacity",
		unit: "%",
		paramKeys: ["opacity"],
		min: 0,
		max: 100,
		step: 1,
		origin: 0,
		toDisplay: (value) => value * 100,
		fromDisplay: (value) => value / 100,
		format: (value) => value.toFixed(0),
	},
	{
		id: "scale",
		label: "Scale",
		unit: "%",
		paramKeys: ["transform.scaleX", "transform.scaleY"],
		min: 1,
		max: 400,
		step: 1,
		origin: 100,
		toDisplay: (value) => value * 100,
		fromDisplay: (value) => value / 100,
		format: (value) => value.toFixed(0),
	},
	{
		id: "rotation",
		label: "Rotation",
		unit: "°",
		paramKeys: ["transform.rotate"],
		min: -360,
		max: 360,
		step: 1,
		origin: 0,
		toDisplay: asIs,
		fromDisplay: asIs,
		format: (value) => value.toFixed(0),
	},
	{
		id: "volume",
		label: "Volume",
		unit: "dB",
		paramKeys: ["volume"],
		min: VOLUME_DB_MIN,
		max: VOLUME_DB_MAX,
		step: 0.5,
		origin: 0,
		toDisplay: asIs,
		fromDisplay: asIs,
		format: (value) => (value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1)),
	},
];
