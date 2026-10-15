import { _electron, expect, test, type ElectronApplication, type Locator, type Page } from "@playwright/test";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// One project's whole life in the desktop app: create, import, edit, play,
// undo/redo, export to disk, quit, relaunch, reopen. Needs ffmpeg + ffprobe.

const studioRoot = resolve(import.meta.dirname, "..");
const CLIP_NAME = "test-clip.mp4";
const CLIP_SECONDS = 3;

let workDir: string;
let userDataDir: string;
let exportDir: string;
let clipPath: string;

test.beforeAll(() => {
	workDir = mkdtempSync(join(tmpdir(), "opencut-studio-e2e-"));
	userDataDir = join(workDir, "user-data");
	exportDir = join(workDir, "exports");
	clipPath = join(workDir, CLIP_NAME);
	mkdirSync(userDataDir);
	mkdirSync(exportDir);
	// testsrc2 burns the timestamp and frame number into each frame.
	execFileSync("ffmpeg", [
		"-v", "error", "-y",
		"-f", "lavfi", "-i", `testsrc2=size=640x360:rate=30:duration=${CLIP_SECONDS}`,
		"-f", "lavfi", "-i", `sine=frequency=440:sample_rate=48000:duration=${CLIP_SECONDS}`,
		"-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest",
		clipPath,
	]);
});

test.afterAll(() => {
	rmSync(workDir, { recursive: true, force: true });
});

function launchApp(): Promise<ElectronApplication> {
	return _electron.launch({
		args: ["."],
		cwd: studioRoot,
		env: {
			...process.env,
			OPENCUT_STUDIO_USER_DATA_DIR: userDataDir,
			OPENCUT_STUDIO_EXPORT_DIR: exportDir,
		},
	});
}

async function openWindow(app: ElectronApplication): Promise<Page> {
	const page = await app.firstWindow();
	await page.waitForLoadState("networkidle");
	await expect(page).toHaveURL(/^app:\/\/studio\/projects/);
	return page;
}

/** Distinct colours in a window region, read via the main process because the
 * preview is a WebGL canvas the page can't read back. */
async function distinctColors(app: ElectronApplication, region: Locator): Promise<number> {
	const box = await region.boundingBox();
	if (!box) throw new Error("region is not visible");
	return app.evaluate(async ({ BrowserWindow }, rect) => {
		const image = await BrowserWindow.getAllWindows()[0].webContents.capturePage(rect);
		const bitmap = image.toBitmap();
		const colors = new Set<number>();
		for (let i = 0; i < bitmap.length; i += 4 * 7) {
			colors.add(((bitmap[i] >> 4) << 8) | ((bitmap[i + 1] >> 4) << 4) | (bitmap[i + 2] >> 4));
		}
		return colors.size;
	}, {
		x: Math.round(box.x),
		y: Math.round(box.y),
		width: Math.round(box.width),
		height: Math.round(box.height),
	});
}

/** A 32x18 RGB thumbnail of a window region, for comparing two captures. */
async function regionThumbnail(app: ElectronApplication, region: Locator): Promise<number[]> {
	const box = await region.boundingBox();
	if (!box) throw new Error("region is not visible");
	return app.evaluate(async ({ BrowserWindow }, rect) => {
		const image = await BrowserWindow.getAllWindows()[0].webContents.capturePage(rect);
		const bitmap = image.resize({ width: 32, height: 18, quality: "good" }).toBitmap();
		const rgb: number[] = [];
		for (let i = 0; i < bitmap.length; i += 4) rgb.push(bitmap[i], bitmap[i + 1], bitmap[i + 2]);
		return rgb;
	}, {
		x: Math.round(box.x),
		y: Math.round(box.y),
		width: Math.round(box.width),
		height: Math.round(box.height),
	});
}

function meanAbsoluteDifference(a: number[], b: number[]): number {
	return a.reduce((sum, value, index) => sum + Math.abs(value - b[index]), 0) / a.length;
}

function timelineClips(page: Page): Locator {
	return page.locator('[data-element-id][data-element-type="video"]');
}

function playheadTime(page: Page): Locator {
	// "current / total" timecodes under the preview, e.g. 00:00:01:16.
	return page.getByText(/^\d\d:\d\d:\d\d:\d\d$/).first();
}

function ffprobe(file: string): {
	format: { duration: string };
	streams: Array<{ codec_type: string; codec_name: string; width?: number; height?: number; nb_frames?: string }>;
} {
	return JSON.parse(
		execFileSync("ffprobe", ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", file], {
			encoding: "utf8",
		}),
	);
}

function meanVolumeDb(file: string): number {
	// volumedetect reports on stderr.
	const { stderr } = spawnSync(
		"ffmpeg",
		["-hide_banner", "-i", file, "-vn", "-af", "volumedetect", "-f", "null", "-"],
		{ encoding: "utf8" },
	);
	const match = /mean_volume: (-?[\d.]+) dB/.exec(stderr);
	if (!match) throw new Error(`no volume reading for ${file}`);
	return Number(match[1]);
}

async function waitForExport(): Promise<string> {
	let file: string | undefined;
	await expect
		.poll(() => {
			file = readdirSync(exportDir).find((name) => !name.endsWith(".crdownload"));
			return file ? statSync(join(exportDir, file)).size : 0;
		}, { timeout: 120_000 })
		.toBeGreaterThan(0);
	// Wait for the size to settle so the download has finished writing.
	let previous = -1;
	await expect
		.poll(() => {
			const size = statSync(join(exportDir, file!)).size;
			const settled = size === previous;
			previous = size;
			return settled;
		}, { intervals: [500] })
		.toBe(true);
	return join(exportDir, file!);
}

test("create, import, edit, play, undo, export, and reopen a project", async () => {
	let app = await launchApp();
	let page = await openWindow(app);

	// Create a project; the first visit shows a welcome dialog.
	await page.getByRole("button", { name: "New project" }).first().click();
	await expect(page).toHaveURL(/\/editor\/[\w-]+$/);
	const projectUrl = page.url();
	await expect(page.getByRole("dialog")).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).toBeHidden();

	// Import: the media card appears once the file is decoded.
	await page.locator('input[type="file"]').setInputFiles(clipPath);
	const mediaCard = page.getByTitle(CLIP_NAME).first();
	await expect(mediaCard).toBeVisible();

	// Add to the timeline.
	await mediaCard.hover();
	await page.getByRole("button", { name: "Add to timeline" }).first().click();
	await expect(timelineClips(page)).toHaveCount(1);
	await expect(page.getByText("00:00:03:00")).toBeVisible();

	// Preview shows the clip's test pattern, not an empty canvas.
	const preview = page.getByLabel("Preview canvas");
	expect(await distinctColors(app, preview)).toBeGreaterThan(100);

	// Effect thumbnails draw on the GPU too; opening the Effects panel must not
	// replace the preview with the thumbnail's sample photo.
	const previewBefore = await regionThumbnail(app, preview);
	await page.getByRole("button", { name: "Effects", exact: true }).first().click();
	await expect(page.getByTitle("Blur").first()).toBeVisible();
	await page.waitForTimeout(500);
	await page.getByRole("button", { name: "Media", exact: true }).first().click();
	await page.waitForTimeout(500);
	expect(meanAbsoluteDifference(previewBefore, await regionThumbnail(app, preview))).toBeLessThan(8);

	// Playback moves the playhead.
	await expect(playheadTime(page)).toHaveText("00:00:00:00");
	await page.locator("body").click({ position: { x: 5, y: 5 } });
	await page.keyboard.press("Space");
	await page.waitForTimeout(1200);
	await page.keyboard.press("Space");
	await expect(playheadTime(page)).not.toHaveText("00:00:00:00");

	// Undo removes the clip, redo restores it.
	await page.keyboard.press("Control+z");
	await expect(timelineClips(page)).toHaveCount(0);
	await page.keyboard.press("Control+Shift+z");
	await expect(timelineClips(page)).toHaveCount(1);

	// Export as MP4 through the export popover.
	await page.getByRole("button", { name: "Export" }).first().click();
	await page.getByRole("button", { name: "Export", exact: true }).last().click();
	const exported = await waitForExport();
	expect(exported.endsWith(".mp4")).toBe(true);

	const probe = ffprobe(exported);
	const video = probe.streams.find((stream) => stream.codec_type === "video");
	const audio = probe.streams.find((stream) => stream.codec_type === "audio");
	expect(video?.codec_name).toBe("h264");
	expect(Number(video?.nb_frames)).toBe(CLIP_SECONDS * 30);
	expect(Number(probe.format.duration)).toBeCloseTo(CLIP_SECONDS, 1);
	expect(audio).toBeDefined();
	// Same loudness as the source tone, so the audio made it through.
	expect(Math.abs(meanVolumeDb(exported) - meanVolumeDb(clipPath))).toBeLessThan(1.5);

	// Quit and relaunch: the project, its media and its timeline persist.
	await page.waitForTimeout(1500); // autosave is debounced
	await app.close();
	app = await launchApp();
	page = await openWindow(app);
	await expect(page.getByText("New project").first()).toBeVisible();
	// The project card shows the clip's first frame, not a blank one.
	const thumbnail = page.getByAltText("Project thumbnail").first();
	await expect(thumbnail).toBeVisible();
	expect(await distinctColors(app, thumbnail)).toBeGreaterThan(20);
	await page.goto(projectUrl);
	await expect(timelineClips(page)).toHaveCount(1);
	await expect(page.getByTitle(CLIP_NAME).first()).toBeVisible();
	expect(await distinctColors(app, page.getByLabel("Preview canvas"))).toBeGreaterThan(100);

	await app.close();
});
