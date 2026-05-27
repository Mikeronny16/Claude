import { NextResponse } from "next/server";
import { PROMPTS } from "@/lib/prompts";

export const dynamic = "force-dynamic";

function generatePromptsText(): string {
  const lines: string[] = [];

  lines.push("═══════════════════════════════════════════════════════════");
  lines.push("      READYPROMPTS — 120 ULTIMATE AI PROMPT KIT");
  lines.push("═══════════════════════════════════════════════════════════");
  lines.push("");
  lines.push("Thank you for your purchase! These prompts work with:");
  lines.push("ChatGPT, Claude, Gemini, Grok, Llama, and any AI model.");
  lines.push("");
  lines.push("HOW TO USE:");
  lines.push("1. Copy the prompt text");
  lines.push("2. Paste into your AI of choice");
  lines.push("3. Replace [BRACKETS] with your specific info");
  lines.push("4. Hit send — get great results");
  lines.push("");

  const categories = [...new Set(PROMPTS.map((p) => p.category))];

  for (const cat of categories) {
    const categoryPrompts = PROMPTS.filter((p) => p.category === cat);
    lines.push("───────────────────────────────────────────────────────────");
    lines.push(`  ${cat.toUpperCase()}  (${categoryPrompts.length} prompts)`);
    lines.push("───────────────────────────────────────────────────────────");
    lines.push("");

    for (let i = 0; i < categoryPrompts.length; i++) {
      const p = categoryPrompts[i];
      lines.push(`${i + 1}. ${p.title}`);
      lines.push("   ─────────────────────────────────────────────────────");
      lines.push(`   ${p.prompt}`);
      lines.push("");
    }
  }

  lines.push("═══════════════════════════════════════════════════════════");
  lines.push("  readyprompts.vercel.app · © 2025 ReadyPrompts");
  lines.push("  Share this with a friend who needs better AI results!");
  lines.push("═══════════════════════════════════════════════════════════");

  return lines.join("\n");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("payment_id");
  const token = searchParams.get("token");

  if (!paymentId || !token) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  // Verify token: sha256(paymentId + DOWNLOAD_SECRET)
  const secret = process.env.DOWNLOAD_SECRET || "rp_secret_2024";
  const encoder = new TextEncoder();
  const data = encoder.encode(paymentId + secret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const expectedToken = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (token !== expectedToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const content = generatePromptsText();
  const bytes = new TextEncoder().encode(content);

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="ReadyPrompts-120-AI-Prompts.txt"',
      "Content-Length": bytes.length.toString(),
      "Cache-Control": "no-store",
    },
  });
}
