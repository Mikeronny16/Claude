// Assembles the editor's Next.js standalone server into build/server, the
// layout the Electron main process runs. `next build` leaves static assets and
// public/ out of the standalone output, so they are copied in beside it.
//
//   bun run scripts/prepare-server.ts      (after `next build` in apps/web)
import { cpSync, existsSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const studioRoot = resolve(import.meta.dirname, "..");
const webRoot = resolve(studioRoot, "../web");
const standalone = join(webRoot, ".next/standalone");
const destination = join(studioRoot, "build/server");

if (!existsSync(join(standalone, "apps/web/server.js"))) {
	console.error(
		`No standalone build at ${standalone}. Run \`bun run build\` in apps/web first.`,
	);
	process.exit(1);
}

rmSync(destination, { recursive: true, force: true });
// verbatimSymlinks keeps bun's relative node_modules links relative.
cpSync(standalone, destination, { recursive: true, verbatimSymlinks: true });
cpSync(
	join(webRoot, ".next/static"),
	join(destination, "apps/web/.next/static"),
	{ recursive: true },
);
cpSync(join(webRoot, "public"), join(destination, "apps/web/public"), {
	recursive: true,
});

console.log(`Editor server ready in ${destination}`);
