import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const PLATFORM_CONTEXT: Record<string, string> = {
  Instagram: "Instagram DM (casual, short, friendly tone, max 3 sentences)",
  LinkedIn: "LinkedIn message (professional tone, concise, value-first)",
  TikTok: "TikTok DM (very casual, Gen Z energy, emoji ok, max 2 sentences)",
  Email: "cold email (subject line + body, professional but warm, max 5 sentences)",
};

export async function POST(req: NextRequest) {
  const { jobTitle, targetClient, platform } = await req.json();

  if (!jobTitle || !targetClient || !platform) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const platformGuide = PLATFORM_CONTEXT[platform] ?? "cold message";

  const prompt = `You are an expert cold outreach copywriter. Generate exactly 3 different cold ${platformGuide} messages.

Sender: ${jobTitle}
Target: ${targetClient}

Rules:
- Each message must be unique in angle/approach
- Lead with their pain or curiosity, NOT "I offer..."
- End with ONE simple low-pressure question or CTA
- No generic filler like "I hope this finds you well"
- Sound human, not robotic
${platform === "Email" ? "- For emails write: Subject: [line]\n\n[body]" : ""}

Return ONLY a JSON array with exactly 3 strings, no extra text:
["message 1", "message 2", "message 3"]`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Generation failed — try again" }, { status: 500 });
    }

    const messages: string[] = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ messages });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
