// Walks the built desktop app through its main screens and saves a screenshot
// of each, for design review. Needs ffmpeg on PATH.
//
//   bun run screenshots -- <output-dir>      (Linux without a display: xvfb-run -a ...)
//
// DESIGNS=classic,ocean,... (preset names) and THEMES=light,dark choose what
// to capture (defaults: the saved design, both themes). Files are named
// <design>-<theme>-<screen>.png.
import { _electron } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const studioRoot = resolve(import.meta.dirname, "..");
const outputDir = resolve(process.argv[2] ?? join(studioRoot, "screenshots"));
const designs = (process.env.DESIGNS ?? "").split(",").filter(Boolean);
const themes = (process.env.THEMES ?? "light,dark").split(",").filter(Boolean);
mkdirSync(outputDir, { recursive: true });

const workDir = mkdtempSync(join(tmpdir(), "opencut-studio-tour-"));
const videoPath = join(workDir, "sunset-drive.mp4");
const audioPath = join(workDir, "soft-chords.m4a");
const ffmpeg = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args]);
ffmpeg([
	"-f", "lavfi",
	"-i", "gradients=s=1280x720:r=30:d=6:c0=0x0f3d5e:c1=0xff6a3d:c2=0x1fb5c4:c3=0x241b5c:nb_colors=4:speed=0.015",
	"-c:v", "libx264", "-pix_fmt", "yuv420p", videoPath,
]);
ffmpeg([
	"-f", "lavfi",
	"-i", "aevalsrc=0.25*sin(2*PI*220*t)+0.18*sin(2*PI*277*t)+0.15*sin(2*PI*330*t):s=48000:d=6",
	"-c:a", "aac", audioPath,
]);

async function addToTimeline(page, card) {
	await card.waitFor();
	await card.hover();
	await page.getByRole("button", { name: "Add to timeline" }).first().click();
}

async function tour({ design, theme }) {
	const prefix = [design, theme].filter(Boolean).join("-");
	const app = await _electron.launch({
		args: ["."],
		cwd: studioRoot,
		// Playwright emulates a light colour scheme unless told otherwise.
		colorScheme: theme,
		env: {
			...process.env,
			OPENCUT_STUDIO_USER_DATA_DIR: join(workDir, `user-data-${prefix}`),
			OPENCUT_STUDIO_EXPORT_DIR: join(workDir, `exports-${prefix}`),
		},
	});
	const page = await app.firstWindow();
	await page.setViewportSize({ width: 1440, height: 900 });
	await page.waitForLoadState("networkidle");
	if (design) {
		// Choose the preset the way a user would, through the Design picker.
		await page.getByRole("button", { name: "Design" }).click();
		await page
			.locator("button[aria-pressed]")
			.filter({ hasText: new RegExp(`${design}$`, "i") })
			.first()
			.click();
		await page.keyboard.press("Escape");
	}
	const shot = async (name) => {
		await page.waitForTimeout(600);
		await page.screenshot({ path: join(outputDir, `${prefix}-${name}.png`) });
		console.log(`saved ${prefix}-${name}.png`);
	};

	await shot("01-projects-empty");

	await page.getByRole("button", { name: "New project" }).first().click();
	await page.waitForURL(/\/editor\//);
	await page.getByRole("dialog").waitFor();
	await shot("02-welcome-dialog");
	await page.keyboard.press("Escape");
	await shot("03-editor-empty");

	const fileInput = page.locator('input[type="file"]');
	await fileInput.setInputFiles(videoPath);
	await addToTimeline(page, page.getByTitle("sunset-drive.mp4").first());
	await fileInput.setInputFiles(audioPath);
	await addToTimeline(page, page.getByTitle("soft-chords.m4a").first());
	await page.getByRole("button", { name: "Text", exact: true }).first().click();
	await addToTimeline(page, page.getByText("Default text", { exact: true }).first());
	await page.getByRole("button", { name: "Media", exact: true }).first().click();
	await page.getByLabel("Preview canvas").click();
	await page.keyboard.press("l");
	await page.keyboard.press("l");
	await shot("04-editor-with-clip");

	for (const tab of ["Text", "Stickers", "Effects", "Captions"]) {
		await page.getByRole("button", { name: tab, exact: true }).first().click();
		await shot(`05-panel-${tab.toLowerCase()}`);
	}
	await page.getByRole("button", { name: "Media", exact: true }).first().click();

	await page.getByRole("button", { name: "Export" }).first().click();
	await shot("06-export");
	await page.keyboard.press("Escape");

	await page.goto("app://studio/projects");
	await page.waitForLoadState("networkidle");
	await shot("07-projects-list");

	await page.getByRole("button", { name: "Design" }).click();
	await shot("08-design-picker");
	await page.keyboard.press("Escape");

	await app.close();
}

try {
	for (const design of designs.length > 0 ? designs : [undefined]) {
		for (const theme of themes) {
			await tour({ design, theme });
		}
	}
} finally {
	rmSync(workDir, { recursive: true, force: true });
}
console.log(`Screenshots in ${outputDir}`);
