// OpenCut Studio's look is three independent choices, each a set of CSS
// tokens in app/globals.css selected by a data attribute on <html>:
// data-palette (colours), data-font (UI font) and data-corners (radius).
// Presets bundle one of each.
export const PALETTES = ["classic", "ocean", "graphite", "aurora"] as const;
export const FONTS = ["inter", "jakarta", "manrope", "bricolage"] as const;
export const CORNERS = ["sharp", "medium", "round", "extra-round"] as const;

export type Palette = (typeof PALETTES)[number];
export type Font = (typeof FONTS)[number];
export type Corners = (typeof CORNERS)[number];

export type DesignSettings = {
	palette: Palette;
	font: Font;
	corners: Corners;
};

export const DESIGN_PRESETS: Record<Palette, DesignSettings> = {
	classic: { palette: "classic", font: "inter", corners: "medium" },
	ocean: { palette: "ocean", font: "jakarta", corners: "round" },
	graphite: { palette: "graphite", font: "manrope", corners: "sharp" },
	aurora: { palette: "aurora", font: "bricolage", corners: "extra-round" },
};

export const DEFAULT_DESIGN: DesignSettings = DESIGN_PRESETS.classic;

export const DESIGN_STORAGE_KEY = "opencut-studio-design";

function pick<T extends string>({
	options,
	value,
	fallback,
}: {
	options: readonly T[];
	value: unknown;
	fallback: T;
}): T {
	return options.find((option) => option === value) ?? fallback;
}

export function parseDesign(raw: unknown): DesignSettings {
	const field = (key: keyof DesignSettings): unknown =>
		typeof raw === "object" && raw !== null ? Reflect.get(raw, key) : undefined;
	return {
		palette: pick({
			options: PALETTES,
			value: field("palette"),
			fallback: DEFAULT_DESIGN.palette,
		}),
		font: pick({ options: FONTS, value: field("font"), fallback: DEFAULT_DESIGN.font }),
		corners: pick({
			options: CORNERS,
			value: field("corners"),
			fallback: DEFAULT_DESIGN.corners,
		}),
	};
}

export function readStoredDesign(): DesignSettings {
	try {
		const stored = localStorage.getItem(DESIGN_STORAGE_KEY);
		return parseDesign(stored ? JSON.parse(stored) : null);
	} catch {
		return DEFAULT_DESIGN;
	}
}

export function applyDesign(design: DesignSettings): void {
	const { dataset } = document.documentElement;
	dataset.palette = design.palette;
	dataset.font = design.font;
	dataset.corners = design.corners;
	try {
		localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(design));
	} catch {
		// Storage unavailable: the choice lasts until reload.
	}
}

// Runs before first paint (inline in <head>) so a saved design never flashes
// the default one first. Mirrors parseDesign without imports.
export const designInitScript = `try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
	DESIGN_STORAGE_KEY,
)})||"{}"),o=${JSON.stringify({
	palette: PALETTES,
	font: FONTS,
	corners: CORNERS,
})},k;for(k in o)if(o[k].indexOf(s[k])>=0)document.documentElement.dataset[k]=s[k]}catch(e){}`;
