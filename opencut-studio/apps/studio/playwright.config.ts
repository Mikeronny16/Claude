import { defineConfig } from "@playwright/test";

// Drives the built desktop app (run `bun run build` first). On Linux without a
// display, run under Xvfb: `xvfb-run -a bun run test:e2e`.
export default defineConfig({
	testDir: "./e2e",
	// *.e2e.ts, so `bun test` (which collects *.spec.ts) leaves these alone.
	testMatch: "**/*.e2e.ts",
	timeout: 240_000,
	expect: { timeout: 30_000 },
	workers: 1,
	reporter: [["list"]],
	use: {
		trace: "retain-on-failure",
	},
});
