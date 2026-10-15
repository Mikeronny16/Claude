import { describe, expect, test } from "bun:test";
import {
	angleToValue,
	arcPath,
	pointerToAngle,
	snapDialValue,
	valueToAngle,
} from "../dial-math";

describe("Titanium Dial geometry", () => {
	test("maps the range onto a 270° sweep", () => {
		expect(valueToAngle({ value: 0, min: 0, max: 100 })).toBe(-135);
		expect(valueToAngle({ value: 50, min: 0, max: 100 })).toBe(0);
		expect(valueToAngle({ value: 100, min: 0, max: 100 })).toBe(135);
		expect(valueToAngle({ value: 0, min: -60, max: 20 })).toBe(67.5);
	});

	test("keeps out-of-range values at the ends", () => {
		expect(valueToAngle({ value: 900, min: 1, max: 400 })).toBe(135);
		expect(valueToAngle({ value: -5, min: 0, max: 100 })).toBe(-135);
	});

	test("turns angles back into stepped values", () => {
		expect(angleToValue({ angle: 0, min: 0, max: 100, step: 1 })).toBe(50);
		expect(angleToValue({ angle: 135, min: -360, max: 360, step: 1 })).toBe(360);
		expect(angleToValue({ angle: 200, min: 0, max: 100, step: 1 })).toBe(100);
		expect(angleToValue({ angle: 1, min: -60, max: 20, step: 0.5 })).toBe(-19.5);
	});

	test("snaps to the step without floating-point noise", () => {
		expect(snapDialValue({ value: 0.30000000000000004, min: 0, max: 1, step: 0.1 })).toBe(0.3);
		expect(snapDialValue({ value: 12.26, min: -60, max: 20, step: 0.5 })).toBe(12.5);
		expect(snapDialValue({ value: 25, min: -60, max: 20, step: 0.5 })).toBe(20);
	});

	test("reads pointer angles clockwise from the top, clamped to the sweep", () => {
		const center = { centerX: 100, centerY: 100 };
		expect(pointerToAngle({ x: 100, y: 0, ...center })).toBe(0);
		expect(pointerToAngle({ x: 200, y: 100, ...center })).toBe(90);
		expect(pointerToAngle({ x: 0, y: 100, ...center })).toBe(-90);
		expect(pointerToAngle({ x: 101, y: 200, ...center })).toBe(135);
		expect(pointerToAngle({ x: 99, y: 200, ...center })).toBe(-135);
	});

	test("draws arcs clockwise from the smaller angle", () => {
		expect(arcPath({ from: 90, to: -90, radius: 10, center: 50 })).toBe(
			"M 40 50 A 10 10 0 0 1 60 50",
		);
		expect(arcPath({ from: -135, to: 135, radius: 10, center: 50 })).toContain(" 0 1 1 ");
	});
});
