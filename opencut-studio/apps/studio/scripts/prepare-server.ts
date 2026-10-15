// Assembles the editor's Next.js standalone server into build/server, the
// layout the Electron main process runs. `next build` leaves static assets and
// public/ out of the standalone output, so they are copied in beside it.
//
//   bun run scripts/prepare-server.ts      (after `next build` in apps/web)
import {
	cpSync,
	existsSync,
	lstatSync,
	readlinkSync,
	rmSync,
	symlinkSync,
} from "node:fs";
import { join, relative, resolve } from "node:path";

const studioRoot = resolve(import.meta.dirname, "..");
const repoRoot = resolve(studioRoot, "../..");
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
// On Windows the standalone node_modules are linked with junctions to absolute
// paths in the repo's node_modules, and copying a link needs admin rights or
// Developer Mode. Copy everything else, then recreate each junction pointing
// at the same path inside the destination.
const windowsLinks: string[] = [];
// verbatimSymlinks keeps bun's relative node_modules links relative.
cpSync(standalone, destination, {
	recursive: true,
	verbatimSymlinks: true,
	filter: (source) => {
		if (process.platform !== "win32" || !lstatSync(source).isSymbolicLink()) {
			return true;
		}
		windowsLinks.push(source);
		return false;
	},
});
for (const link of windowsLinks) {
	const repoPath = relative(repoRoot, readlinkSync(link).replace(/^\\\\\?\\/, ""));
	if (repoPath.startsWith("..")) {
		throw new Error(`${link} points outside the repo`);
	}
	const target = join(destination, repoPath);
	// Next doesn't trace every package a link points to; those links dangle.
	if (existsSync(target)) {
		symlinkSync(target, join(destination, relative(standalone, link)), "junction");
	}
}
cpSync(
	join(webRoot, ".next/static"),
	join(destination, "apps/web/.next/static"),
	{ recursive: true },
);
cpSync(join(webRoot, "public"), join(destination, "apps/web/public"), {
	recursive: true,
});

console.log(`Editor server ready in ${destination}`);
