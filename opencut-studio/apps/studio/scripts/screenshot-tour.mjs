// Walks the built desktop app through its main screens and saves a screenshot
// of each, in light and dark mode, for design review. Needs ffmpeg on PATH.
//
//   bun run screenshots -- <output-dir>      (Linux without a display: xvfb-run -a ...)
import { _electron } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const studioRoot = resolve(import.meta.dirname, "..");
const outputDir = resolve(process.argv[2] ?? join(studioRoot, "screenshots"));
mkdirSync(outputDir, { recursive: true });

const workDir = mkdtempSync(join(tmpdir(), "opencut-studio-tour-"));
const clipPath = join(workDir, "sample-clip.mp4");
execFileSync("ffmpeg", [
	"-v", "error", "-y",
	"-f", "lavfi", "-i", "testsrc2=size=1280x720:rate=30:duration=6",
	"-f", "lavfi", "-i", "sine=frequency=330:sample_rate=48000:duration=6",
	"-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest",
	clipPath,
]);

async function tour(theme) {
	const app = await _electron.launch({
		args: ["."],
		cwd: studioRoot,
		env: {
			...process.env,
			OPENCUT_STUDIO_USER_DATA_DIR: join(workDir, `user-data-${theme}`),
			OPENCUT_STUDIO_EXPORT_DIR: join(workDir, `exports-${theme}`),
		},
	});
	await app.evaluate(({ nativeTheme }, source) => {
		nativeTheme.themeSource = source;
	}, theme);
	const page = await app.firstWindow();
	await page.setViewportSize({ width: 1440, height: 900 });
	const shot = async (name) => {
		await page.waitForTimeout(600);
		await page.screenshot({ path: join(outputDir, `${theme}-${name}.png`) });
		console.log(`saved ${theme}-${name}.png`);
	};

	await page.waitForLoadState("networkidle");
	await shot("01-projects-empty");

	await page.getByRole("button", { name: "New project" }).first().click();
	await page.waitForURL(/\/editor\//);
	await page.getByRole("dialog").waitFor();
	await shot("02-welcome-dialog");
	await page.keyboard.press("Escape");
	await shot("03-editor-empty");

	await page.locator('input[type="file"]').setInputFiles(clipPath);
	const card = page.getByTitle("sample-clip.mp4").first();
	await card.waitFor();
	await card.hover();
	await page.getByRole("button", { name: "Add to timeline" }).first().click();
	await page.locator("[data-element-id]").first().waitFor();
	await page.getByLabel("Preview canvas").click();
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

	await app.close();
}

try {
	await tour("light");
	await tour("dark");
} finally {
	rmSync(workDir, { recursive: true, force: true });
}
console.log(`Screenshots in ${outputDir}`);
