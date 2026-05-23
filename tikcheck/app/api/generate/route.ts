import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { action, input, platform, niche } = await req.json();

    let prompt = "";

    if (action === "hook") {
      prompt = `You are a viral TikTok strategist. Generate exactly 5 scroll-stopping hooks for a video about: "${input}"
Rules: Each hook under 12 words. Different angles. Start with curiosity/shock/pain/controversy/relatable.
Return ONLY a JSON array of 5 strings: ["hook1","hook2","hook3","hook4","hook5"]`;
    }

    if (action === "caption") {
      prompt = `You are a social media expert. Enhance this caption to be more engaging and viral: "${input}"
Platform: ${platform || "TikTok"}
Rules: Keep the core message. Add emotion, punch, hook. Add 2-3 emojis max. Add a CTA. Max 150 words.
Return ONLY a JSON object: {"caption": "enhanced caption here", "cta": "suggested CTA"}`;
    }

    if (action === "hashtags") {
      prompt = `Generate 30 relevant hashtags for a ${platform || "TikTok"} creator in the "${niche || input}" niche.
Mix: 10 mega (1M+), 10 medium (100K-1M), 10 niche (under 100K).
Return ONLY a JSON object: {"mega": ["#tag1",...], "medium": ["#tag1",...], "niche": ["#tag1",...]}`;
    }

    if (action === "score") {
      prompt = `You are a viral content expert. Analyze this social media caption and give it a virality score.
Caption: "${input}"

Score it 1-100 based on: hook strength, emotional pull, clarity, CTA quality, platform fit.
Return ONLY a JSON object:
{"score": 72, "grade": "B+", "good": ["strength1","strength2","strength3"], "improve": ["weakness1","weakness2","weakness3"], "rewrite": "improved version here"}`;
    }

    if (action === "calendar") {
      prompt = `Create a 30-day content calendar for a ${platform || "TikTok"} creator in the "${niche || input}" niche.
Return exactly 30 post ideas. Use these content types: Tutorial, POV, Story, Tips, Challenge, Trend, Behind the scenes, Q&A, Motivation, Reaction.
Return ONLY a JSON array of exactly 30 objects:
[{"day":1,"type":"Tutorial","idea":"specific post idea","hook":"opening line"},...] `;
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: action === "calendar" ? 2048 : 1024,
      temperature: 0.85,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = raw.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (!jsonMatch) return NextResponse.json({ error: "Try again" }, { status: 500 });

    return NextResponse.json({ result: JSON.parse(jsonMatch[0]) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
