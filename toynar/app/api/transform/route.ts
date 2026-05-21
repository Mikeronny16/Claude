import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY! });

const MODEL = "fal-ai/face-to-sticker";

// POST — submit transformation job
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const blob = new Blob([bytes], { type: file.type });

    // Upload image to fal storage to get a URL
    const imageUrl = await fal.storage.upload(blob as File);

    const { request_id } = await fal.queue.submit(MODEL, {
      input: {
        image_url: imageUrl,
        prompt: "a person as a collectible toy figurine, smooth plastic, vibrant colors",
        instant_id_strength: 0.8,
        upscale: true,
      },
    });

    return NextResponse.json({ id: request_id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Transform error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — check status
export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing request id" }, { status: 400 });
  }

  try {
    const status = await fal.queue.status(MODEL, {
      requestId: id,
      logs: false,
    });

    if (status.status === "COMPLETED") {
      const result = await fal.queue.result(MODEL, { requestId: id });
      const data = result.data as { images?: Array<{ url: string }> };
      const output = data.images?.[0]?.url ?? null;
      return NextResponse.json({ status: "succeeded", output });
    }

    if (status.status === "IN_QUEUE" || status.status === "IN_PROGRESS") {
      return NextResponse.json({ status: "processing" });
    }

    return NextResponse.json({ status: "failed", error: "Unknown failure" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Status error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
