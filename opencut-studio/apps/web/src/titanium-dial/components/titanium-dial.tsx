"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/utils/ui";
import {
	angleToValue,
	arcPath,
	DIAL_SWEEP_DEGREES,
	pointerToAngle,
	polarPoint,
	snapDialValue,
	valueToAngle,
} from "../dial-math";

const SIZE = 200;
const CENTER = SIZE / 2;
const TICK_COUNT = 37;
const MAJOR_TICK_EVERY = 6;
const TRACK_RADIUS = 74;

/**
 * Circular titanium control. Dragging or arrow keys call `onChange` with
 * each new value (a live preview); releasing calls `onCommit` once.
 */
export function TitaniumDial({
	value,
	min,
	max,
	step,
	origin,
	label,
	unit,
	format,
	disabled = false,
	onChange,
	onCommit,
	onReset,
}: {
	value: number | null;
	min: number;
	max: number;
	step: number;
	origin: number;
	label: string;
	unit: string;
	format: (value: number) => string;
	disabled?: boolean;
	onChange: (value: number) => void;
	onCommit: () => void;
	onReset?: () => void;
}) {
	const id = useId();
	const [isDragging, setIsDragging] = useState(false);
	const hasPendingKeyCommit = useRef(false);
	const isInteractive = !disabled && value !== null;

	const valueAngle =
		value === null ? -DIAL_SWEEP_DEGREES / 2 : valueToAngle({ value, min, max });
	const originAngle = valueToAngle({ value: origin, min, max });
	const lit = (angle: number) =>
		value !== null &&
		angle >= Math.min(originAngle, valueAngle) - 0.01 &&
		angle <= Math.max(originAngle, valueAngle) + 0.01;

	const setFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const angle = pointerToAngle({
			x: event.clientX,
			y: event.clientY,
			centerX: rect.left + rect.width / 2,
			centerY: rect.top + rect.height / 2,
		});
		const next = angleToValue({ angle, min, max, step });
		if (next !== value) onChange(next);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (!isInteractive || value === null) return;
		const big = step * 10;
		const deltas: Record<string, number> = {
			ArrowUp: step,
			ArrowRight: step,
			ArrowDown: -step,
			ArrowLeft: -step,
			PageUp: big,
			PageDown: -big,
		};
		let next: number | null = null;
		if (event.key in deltas) {
			const delta = deltas[event.key] * (event.shiftKey ? 10 : 1);
			next = snapDialValue({ value: value + delta, min, max, step });
		} else if (event.key === "Home") {
			next = min;
		} else if (event.key === "End") {
			next = max;
		}
		if (next === null) return;
		event.preventDefault();
		if (next !== value) {
			onChange(next);
			hasPendingKeyCommit.current = true;
		}
	};

	const handleKeyUp = () => {
		if (!hasPendingKeyCommit.current) return;
		hasPendingKeyCommit.current = false;
		onCommit();
	};

	const indicator = polarPoint({ angle: valueAngle, radius: TRACK_RADIUS, center: CENTER });
	const notchInner = polarPoint({ angle: valueAngle, radius: 44, center: CENTER });
	const notchOuter = polarPoint({ angle: valueAngle, radius: 56, center: CENTER });

	return (
		<div
			role="slider"
			tabIndex={isInteractive ? 0 : -1}
			aria-label={label}
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value ?? undefined}
			aria-valuetext={value === null ? "No value" : `${format(value)} ${unit}`}
			aria-disabled={!isInteractive}
			className={cn(
				"group relative aspect-square w-full max-w-[11rem] touch-none rounded-full select-none outline-none",
				"focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2",
				isInteractive ? "cursor-grab" : "cursor-not-allowed opacity-55",
				isDragging && "cursor-grabbing",
			)}
			onPointerDown={(event) => {
				if (!isInteractive || event.button !== 0) return;
				event.currentTarget.setPointerCapture(event.pointerId);
				setIsDragging(true);
				setFromPointer(event);
			}}
			onPointerMove={(event) => {
				if (isDragging) setFromPointer(event);
			}}
			onPointerUp={(event) => {
				if (!isDragging) return;
				event.currentTarget.releasePointerCapture(event.pointerId);
				setIsDragging(false);
				onCommit();
			}}
			onPointerCancel={() => {
				if (!isDragging) return;
				setIsDragging(false);
				onCommit();
			}}
			onKeyDown={handleKeyDown}
			onKeyUp={handleKeyUp}
			onDoubleClick={isInteractive ? onReset : undefined}
		>
			<svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-full" aria-hidden>
				<defs>
					<radialGradient id={`${id}-bezel`} cx="50%" cy="35%" r="70%">
						<stop offset="0" stopColor="#2e3238" />
						<stop offset="1" stopColor="#131417" />
					</radialGradient>
					<linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stopColor="#e0e4e9" stopOpacity="0.55" />
						<stop offset="0.5" stopColor="#555d67" stopOpacity="0.5" />
						<stop offset="1" stopColor="#34383e" stopOpacity="0.8" />
					</linearGradient>
					<radialGradient id={`${id}-face`} cx="45%" cy="30%" r="75%">
						<stop offset="0" stopColor="#3a3f46" />
						<stop offset="0.6" stopColor="#25282d" />
						<stop offset="1" stopColor="#1b1d21" />
					</radialGradient>
				</defs>

				<circle cx={CENTER} cy={CENTER} r={96} fill={`url(#${id}-bezel)`} stroke={`url(#${id}-edge)`} strokeWidth={1.5} />

				{Array.from({ length: TICK_COUNT }, (_, index) => {
					const angle = -DIAL_SWEEP_DEGREES / 2 + (index * DIAL_SWEEP_DEGREES) / (TICK_COUNT - 1);
					const isMajor = index % MAJOR_TICK_EVERY === 0;
					const a = polarPoint({ angle, radius: 84, center: CENTER });
					const b = polarPoint({ angle, radius: isMajor ? 91 : 88, center: CENTER });
					return (
						<line
							key={angle}
							x1={a.x}
							y1={a.y}
							x2={b.x}
							y2={b.y}
							stroke={lit(angle) ? "#e0e4e9" : "#555d67"}
							strokeOpacity={lit(angle) ? 0.95 : isMajor ? 0.9 : 0.55}
							strokeWidth={isMajor ? 1.6 : 1}
							strokeLinecap="round"
						/>
					);
				})}

				<path
					d={arcPath({ from: -DIAL_SWEEP_DEGREES / 2, to: DIAL_SWEEP_DEGREES / 2, radius: TRACK_RADIUS, center: CENTER })}
					stroke="#25282d"
					strokeWidth={4}
					strokeLinecap="round"
					fill="none"
				/>
				{value !== null && Math.abs(valueAngle - originAngle) > 0.01 && (
					<path
						d={arcPath({ from: originAngle, to: valueAngle, radius: TRACK_RADIUS, center: CENTER })}
						stroke="#e0e4e9"
						strokeWidth={4}
						strokeLinecap="round"
						fill="none"
						className={cn(
							"transition-[filter] duration-150",
							isDragging && "drop-shadow-[0_0_6px_rgba(224,228,233,0.55)]",
							"group-focus-visible:drop-shadow-[0_0_6px_rgba(224,228,233,0.55)]",
						)}
					/>
				)}

				<circle cx={CENTER} cy={CENTER} r={60} fill={`url(#${id}-face)`} stroke="rgba(224,228,233,0.12)" strokeWidth={1} />
				<circle cx={CENTER} cy={CENTER} r={52} fill="none" stroke="rgba(224,228,233,0.05)" strokeWidth={1} />

				{value !== null && (
					<>
						<line x1={notchInner.x} y1={notchInner.y} x2={notchOuter.x} y2={notchOuter.y} stroke="#e0e4e9" strokeWidth={3} strokeLinecap="round" />
						<circle cx={indicator.x} cy={indicator.y} r={5} fill="#e0e4e9" stroke="#101114" strokeWidth={1.5} />
					</>
				)}
			</svg>

			<div className="pointer-events-none absolute inset-0 grid place-items-center">
				<div className="flex flex-col items-center leading-none">
					<span className="text-[1.65rem] font-semibold tracking-tight text-[var(--ti-highlight)] tabular-nums">
						{value === null ? "—" : format(value)}
					</span>
					<span className="text-muted-foreground mt-1 text-[0.7rem] font-medium">
						{unit}
					</span>
				</div>
			</div>
		</div>
	);
}
