// `opencut-wasm` is built with wasm-bindgen's "bundler" target, which expects a
// bundler to instantiate `opencut_wasm_bg.wasm` with its JS glue as imports.
// Bun's test runner doesn't, so tests touching media time crash on import.
// This preload does the instantiation a bundler would. Test-only.
import { plugin } from "bun";
import { readFile } from "node:fs/promises";

plugin({
	name: "opencut-wasm-bundler-target",
	setup(build) {
		build.onLoad({ filter: /opencut_wasm_bg\.wasm$/ }, async ({ path }) => {
			const module = new WebAssembly.Module(await readFile(path));
			const glue = await import(path.replace(/\.wasm$/, ".js"));
			const instance = new WebAssembly.Instance(module, {
				"./opencut_wasm_bg.js": glue,
			});
			return { exports: instance.exports, loader: "object" };
		});
	},
});
