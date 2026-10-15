import { describe, expect, test } from "bun:test";
import { getTrackLabels } from "../track-labels";

describe("getTrackLabels", () => {
	test("numbers picture layers from the bottom and audio from the top", () => {
		const labels = getTrackLabels({
			tracks: [
				{ id: "title", type: "text" },
				{ id: "overlay", type: "video" },
				{ id: "sticker", type: "graphic" },
				{ id: "blur", type: "effect" },
				{ id: "main", type: "video" },
				{ id: "voice", type: "audio" },
				{ id: "music", type: "audio" },
			],
		});
		expect(labels.get("main")).toEqual({ code: "V1", name: "Video 1" });
		expect(labels.get("overlay")).toEqual({ code: "V2", name: "Video 2" });
		expect(labels.get("title")).toEqual({ code: "T1", name: "Text 1" });
		expect(labels.get("sticker")).toEqual({ code: "G1", name: "Graphics 1" });
		expect(labels.get("blur")).toEqual({ code: "FX1", name: "Effects 1" });
		expect(labels.get("voice")).toEqual({ code: "A1", name: "Audio 1" });
		expect(labels.get("music")).toEqual({ code: "A2", name: "Audio 2" });
	});

	test("labels every track once", () => {
		const labels = getTrackLabels({
			tracks: [
				{ id: "a", type: "video" },
				{ id: "b", type: "video" },
				{ id: "c", type: "video" },
			],
		});
		expect([...labels.values()].map((label) => label.code)).toEqual(["V1", "V2", "V3"]);
		expect(labels.get("a")?.code).toBe("V3");
	});
});
