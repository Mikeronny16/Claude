"use client";

import { useState } from "react";
import type { ElementType } from "react";
import { Contrast, RotateCw, Scaling, Volume2 } from "lucide-react";
import { hasKeyframesForPath } from "@/animation";
import { useEditor } from "@/editor/use-editor";
import {
	getElementParams,
	readElementParamValue,
	writeElementParamValue,
	type ElementParamDefinition,
} from "@/params/registry";
import type { TimelineElement } from "@/timeline";
import { useElementSelection } from "@/timeline/hooks/element/use-element-selection";
import { cn } from "@/utils/ui";
import { DIAL_TARGETS, type DialTarget, type DialTargetId } from "../targets";
import { TitaniumDial } from "./titanium-dial";

const TARGET_ICONS: Record<DialTargetId, ElementType<{ className?: string }>> = {
	opacity: Contrast,
	scale: Scaling,
	rotation: RotateCw,
	volume: Volume2,
};

type TargetState = {
	target: DialTarget;
	/** The params to write, or null when the dial can't drive this target. */
	params: ElementParamDefinition[] | null;
	reason: string | null;
};

function getTargetState({
	target,
	element,
}: {
	target: DialTarget;
	element: TimelineElement | null;
}): TargetState {
	if (!element) return { target, params: null, reason: null };
	const available = getElementParams({ element });
	const params = target.paramKeys.flatMap((key) =>
		available.filter((param) => param.key === key),
	);
	if (params.length !== target.paramKeys.length) {
		return {
			target,
			params: null,
			reason: `${target.label} doesn't apply to ${element.type} clips.`,
		};
	}
	const isAnimated = target.paramKeys.some((key) =>
		hasKeyframesForPath({ animations: element.animations, propertyPath: key }),
	);
	if (isAnimated) {
		return {
			target,
			params: null,
			reason: `${target.label} is animated. Edit its keyframes in the Inspector.`,
		};
	}
	return { target, params, reason: null };
}

/**
 * The Titanium Dial beside the timeline: turns opacity, scale, rotation or
 * volume of the selected clip. Each drag or key press is one undo step.
 */
export function TitaniumDialPanel() {
	const editor = useEditor();
	useEditor((e) => e.scenes.getActiveSceneOrNull());
	const { selectedElements } = useElementSelection();
	const [chosenId, setChosenId] = useState<DialTargetId>("opacity");

	const selected =
		selectedElements.length === 1
			? (editor.timeline.getElementsWithTracks({ elements: selectedElements })[0] ??
				null)
			: null;
	const element = selected?.element ?? null;

	const states = DIAL_TARGETS.map((target) => getTargetState({ target, element }));
	const active =
		states.find((state) => state.target.id === chosenId && state.params) ??
		states.find((state) => state.params) ??
		states.find((state) => state.target.id === chosenId) ??
		states[0];
	const { target, params } = active;

	const paramValue =
		element && params ? readElementParamValue({ element, param: params[0] }) : null;
	const value = typeof paramValue === "number" ? target.toDisplay(paramValue) : null;

	const preview = (displayValue: number) => {
		if (!selected || !params) return;
		const nextValue = target.fromDisplay(displayValue);
		const updated = params.reduce(
			(current, param) =>
				writeElementParamValue({ element: current, param, value: nextValue }),
			selected.element,
		);
		editor.timeline.previewElements({
			updates: [
				{ trackId: selected.track.id, elementId: selected.element.id, updates: updated },
			],
		});
	};
	const commit = () => editor.timeline.commitPreview();
	const reset = () => {
		const defaultValue = params?.[0]?.default;
		if (typeof defaultValue !== "number") return;
		preview(target.toDisplay(defaultValue));
		commit();
	};

	const status = !element
		? selectedElements.length > 1
			? "Select one clip to adjust it."
			: "Select a clip on the timeline."
		: (active.reason ?? "Drag, or use the arrow keys. Double-click resets.");

	return (
		<section
			aria-label="Titanium Dial"
			className="panel bg-background hidden h-full w-[19rem] shrink-0 flex-col overflow-hidden rounded-sm border xl:flex"
		>
			<header className="flex items-center justify-between gap-3 border-b px-3 py-2">
				<span className="text-xs font-semibold">Adjust</span>
				<span className="text-muted-foreground truncate text-xs">
					{element?.name ?? "No clip selected"}
				</span>
			</header>
			<div className="flex min-h-0 flex-1 items-center gap-3 overflow-y-auto p-3">
				<div className="flex w-[10rem] shrink-0 flex-col items-center gap-2">
					<TitaniumDial
						value={value}
						min={target.min}
						max={target.max}
						step={target.step}
						origin={target.origin}
						label={target.label}
						unit={target.unit}
						format={target.format}
						disabled={!params}
						onChange={preview}
						onCommit={commit}
						onReset={reset}
					/>
					<p
						aria-live="polite"
						className="text-muted-foreground min-h-8 text-center text-[0.68rem] leading-snug"
					>
						{status}
					</p>
				</div>
				<div aria-label="Dial parameter" className="flex flex-1 flex-col gap-1">
					{states.map((state) => {
						const Icon = TARGET_ICONS[state.target.id];
						const isActive = state.target.id === target.id;
						return (
							<button
								key={state.target.id}
								type="button"
								aria-pressed={isActive}
								disabled={!state.params}
								title={state.reason ?? undefined}
								onClick={() => setChosenId(state.target.id)}
								className={cn(
									"text-muted-foreground flex h-8 items-center gap-2 rounded-md px-2 text-xs font-medium transition-colors duration-150",
									"hover:bg-accent hover:text-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
									"disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
									isActive && state.params && "bg-accent text-primary",
								)}
							>
								<Icon className="size-4" />
								{state.target.label}
							</button>
						);
					})}
				</div>
			</div>
		</section>
	);
}
