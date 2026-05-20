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

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const prediction = await replicate.predictions.create({
      model: "fofr/face-to-many",
      input: {
        image: dataUrl,
        style: "Toy",
        prompt: "TOK",
        lora_scale: 1,
        denoising_strength: 1,
        instant_id_strength: 0.8,
        control_depth_strength: 0.8,
      },
    });

    return NextResponse.json({ id: prediction.id });
  } catch (err) {
    console.error("Transform error:", err);
    return NextResponse.json({ error: "Failed to start transform" }, { status: 500 });
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
  } catch (err) {
    console.error("Status error:", err);
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 });
  }
}
