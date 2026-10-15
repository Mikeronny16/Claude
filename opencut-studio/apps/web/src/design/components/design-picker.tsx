"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { PaintBoardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/ui";
import {
	CORNERS,
	DEFAULT_DESIGN,
	DESIGN_PRESETS,
	FONTS,
	PALETTES,
	applyDesign,
	readStoredDesign,
	type Corners,
	type DesignSettings,
	type Font,
	type Palette,
} from "../designs";

// Swatches for the picker; the real tokens live in app/globals.css.
const PALETTE_INFO: Record<
	Palette,
	{ label: string; background: string; surface: string; accent: string }
> = {
	classic: { label: "Classic", background: "#0d0d0d", surface: "#1a1a1a", accent: "#38bdf8" },
	ocean: { label: "Ocean", background: "#040d1a", surface: "#071528", accent: "#06b6d4" },
	graphite: { label: "Graphite", background: "#0f0f10", surface: "#18181a", accent: "#ff5a1f" },
	aurora: {
		label: "Aurora",
		background: "#0c0911",
		surface: "#15101d",
		accent: "linear-gradient(90deg, #ff3d8b, #ffb347)",
	},
};

const FONT_INFO: Record<Font, { label: string; family: string }> = {
	inter: { label: "Inter", family: "var(--font-inter)" },
	jakarta: { label: "Jakarta", family: "var(--font-jakarta)" },
	manrope: { label: "Manrope", family: "var(--font-manrope)" },
	bricolage: { label: "Bricolage", family: "var(--font-bricolage)" },
};

const CORNER_INFO: Record<Corners, { label: string; radius: string }> = {
	sharp: { label: "Sharp", radius: "2px" },
	medium: { label: "Medium", radius: "5px" },
	round: { label: "Round", radius: "8px" },
	"extra-round": { label: "Extra", radius: "11px" },
};

function isSameDesign({
	design,
	preset,
}: {
	design: DesignSettings;
	preset: DesignSettings;
}): boolean {
	return (
		design.palette === preset.palette &&
		design.font === preset.font &&
		design.corners === preset.corners
	);
}

export function DesignPicker({ className }: { className?: string }) {
	const [design, setDesign] = useState<DesignSettings>(DEFAULT_DESIGN);

	const update = (next: DesignSettings) => {
		setDesign(next);
		applyDesign(next);
	};

	return (
		<Popover
			onOpenChange={(open) => {
				// Read on open: the stored design may have changed in another window.
				if (open) setDesign(readStoredDesign());
			}}
		>
			<PopoverTrigger asChild>
				<Button
					size="icon"
					variant="ghost"
					className={cn("size-8", className)}
					aria-label="Design"
					title="Design"
				>
					<HugeiconsIcon icon={PaintBoardIcon} className="size-[1.1rem]!" />
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-[22rem] space-y-4 p-4">
				<div>
					<h2 className="text-sm font-semibold">Design</h2>
					<p className="text-muted-foreground text-xs">
						Start from a preset, then fine-tune any detail.
					</p>
				</div>

				<Section title="Presets">
					<div className="grid grid-cols-2 gap-2">
						{PALETTES.map((palette) => {
							const preset = DESIGN_PRESETS[palette];
							return (
								<PresetCard
									key={palette}
									preset={preset}
									isSelected={isSameDesign({ design, preset })}
									onSelect={() => update(preset)}
								/>
							);
						})}
					</div>
				</Section>

				<Section title="Colors">
					<OptionRow>
						{PALETTES.map((palette) => {
							const info = PALETTE_INFO[palette];
							return (
								<OptionButton
									key={palette}
									label={info.label}
									isSelected={design.palette === palette}
									onSelect={() => update({ ...design, palette })}
								>
									<span
										className="relative block size-7 overflow-hidden rounded-full border border-white/10"
										style={{ background: info.background }}
									>
										<span
											className="absolute inset-x-1.5 bottom-1.5 h-1.5 rounded-full"
											style={{ background: info.accent }}
										/>
									</span>
								</OptionButton>
							);
						})}
					</OptionRow>
				</Section>

				<Section title="Font">
					<OptionRow>
						{FONTS.map((font) => (
							<OptionButton
								key={font}
								label={FONT_INFO[font].label}
								isSelected={design.font === font}
								onSelect={() => update({ ...design, font })}
							>
								<span
									className="text-lg leading-7"
									style={{ fontFamily: FONT_INFO[font].family }}
								>
									Aa
								</span>
							</OptionButton>
						))}
					</OptionRow>
				</Section>

				<Section title="Corners">
					<OptionRow>
						{CORNERS.map((corners) => (
							<OptionButton
								key={corners}
								label={CORNER_INFO[corners].label}
								isSelected={design.corners === corners}
								onSelect={() => update({ ...design, corners })}
							>
								<span
									className="border-foreground/70 block size-6 border-t-2 border-l-2"
									style={{ borderTopLeftRadius: CORNER_INFO[corners].radius }}
								/>
							</OptionButton>
						))}
					</OptionRow>
				</Section>
			</PopoverContent>
		</Popover>
	);
}

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="space-y-2">
			<h3 className="text-muted-foreground text-xs font-medium">{title}</h3>
			{children}
		</section>
	);
}

function OptionRow({ children }: { children: ReactNode }) {
	return <div className="grid grid-cols-4 gap-1.5">{children}</div>;
}

function OptionButton({
	label,
	isSelected,
	onSelect,
	children,
}: {
	label: string;
	isSelected: boolean;
	onSelect: () => void;
	children: ReactNode;
}) {
	return (
		<button
			type="button"
			aria-pressed={isSelected}
			onClick={onSelect}
			className={cn(
				"hover:bg-accent flex flex-col items-center gap-1 rounded-md border px-1 py-2 text-[0.7rem] transition-colors",
				isSelected ? "border-primary bg-accent" : "border-transparent",
			)}
		>
			<span className="flex h-7 items-center">{children}</span>
			{label}
		</button>
	);
}

function PresetCard({
	preset,
	isSelected,
	onSelect,
}: {
	preset: DesignSettings;
	isSelected: boolean;
	onSelect: () => void;
}) {
	const palette = PALETTE_INFO[preset.palette];
	const radius = CORNER_INFO[preset.corners].radius;
	const fontStyle: CSSProperties = { fontFamily: FONT_INFO[preset.font].family };

	return (
		<button
			type="button"
			aria-pressed={isSelected}
			onClick={onSelect}
			className={cn(
				"rounded-lg border-2 p-1 text-left transition-colors",
				isSelected ? "border-primary" : "hover:border-border border-transparent",
			)}
		>
			{/* A tiny editor: panels, preview and an export button. */}
			<span
				className="flex h-16 flex-col gap-1 overflow-hidden rounded-md p-1.5"
				style={{ background: palette.background }}
			>
				<span className="flex items-center justify-between">
					<span className="text-[0.6rem] text-white/80" style={fontStyle}>
						Aa
					</span>
					<span
						className="h-2 w-6"
						style={{ background: palette.accent, borderRadius: radius }}
					/>
				</span>
				<span className="flex flex-1 gap-1">
					<span className="w-1/4" style={{ background: palette.surface, borderRadius: radius }} />
					<span className="flex-1" style={{ background: palette.surface, borderRadius: radius }} />
				</span>
			</span>
			<span className="mt-1 block px-0.5 text-xs font-medium" style={fontStyle}>
				{palette.label}
			</span>
		</button>
	);
}
