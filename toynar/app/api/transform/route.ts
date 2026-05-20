import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// POST — start transformation
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Upload image to Replicate (more reliable than base64)
    const bytes = await file.arrayBuffer();
    const blob = new Blob([bytes], { type: file.type });
    const uploaded = await replicate.files.create(blob);
    const imageUrl = uploaded.urls.get;

    const prediction = await replicate.predictions.create({
      model: "fofr/face-to-many",
      input: {
        image: imageUrl,
        style: "Toy",
        prompt: "TOK",
        lora_scale: 1,
        denoising_strength: 1,
        instant_id_strength: 0.8,
        control_depth_strength: 0.8,
      },
    });

    return NextResponse.json({ id: prediction.id });
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
    return NextResponse.json({ error: "Missing prediction id" }, { status: 400 });
  }

  try {
    const prediction = await replicate.predictions.get(id);
    return NextResponse.json({
      status: prediction.status,
      output: prediction.output,
      error: prediction.error ?? null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Status error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
