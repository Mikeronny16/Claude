import { describe, expect, test } from "bun:test";
import { wasmCompositor } from "../wasm-compositor";

describe("wasmCompositor.render", () => {
	// Without a GPU, renderFrame fails right after deserializing the frame, so
	// any other error means the descriptor itself was rejected.
	test("sends scene effects in the shape opencut-wasm accepts", () => {
		expect(() =>
			wasmCompositor.render({
				width: 16,
				height: 16,
				clear: { color: [0, 0, 0, 1] },
				items: [
					{
						type: "sceneEffect",
						effectPassGroups: [[{ shader: "blur", uniforms: { u_radius: 4 } }]],
					},
				],
			}),
		).toThrow("GPU context not initialized");
	});
});
