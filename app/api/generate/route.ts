import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateContent, TOOL_PROMPTS } from "@/lib/claude";

const TOOL_CREDITS: Record<string, number> = {
  facebook_post: 1,
  product_description: 1,
  marketing_caption: 1,
  email_reply: 1,
  hashtag: 1,
  blog_outline: 2,
  translator: 1,
};

// IP-based rate limiting for demo (in-memory, resets on restart)
const ipRequests = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const session = await auth();

    // Demo mode: unauthenticated users get 3 free tries per IP per day
    if (!session?.user?.id) {
      const now = Date.now();
      const record = ipRequests.get(ip) ?? { count: 0, resetAt: now + 86400000 };
      if (now > record.resetAt) {
        record.count = 0;
        record.resetAt = now + 86400000;
      }
      if (record.count >= 3) {
        return NextResponse.json({ error: "Demo limit reached. Please sign up for more generations." }, { status: 429 });
      }
      record.count++;
      ipRequests.set(ip, record);

      const { toolType, prompt } = await req.json();
      const systemPrompt = TOOL_PROMPTS[toolType] ?? TOOL_PROMPTS.facebook_post;
      const output = await generateContent(systemPrompt, prompt);
      return NextResponse.json({ output, variations: output.split("---").map((s: string) => s.trim()).filter(Boolean) });
    }

    const { toolType, prompt, tone, length, audience } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const creditsNeeded = TOOL_CREDITS[toolType] ?? 1;

    if (user.credits < creditsNeeded) {
      return NextResponse.json({ error: "Insufficient credits. Please upgrade your plan." }, { status: 402 });
    }

    const systemPrompt = TOOL_PROMPTS[toolType] ?? TOOL_PROMPTS.facebook_post;
    const fullPrompt = `Tool: ${toolType}
Topic/Input: ${prompt}
Tone: ${tone ?? "casual"}
Length: ${length ?? "medium"}
Target Audience: ${audience ?? "general Myanmar audience"}

Please generate 3 variations separated by "---".`;

    const output = await generateContent(systemPrompt, fullPrompt);
    const variations = output.split("---").map((s: string) => s.trim()).filter(Boolean);

    // Deduct credits and log
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { decrement: creditsNeeded } },
      }),
      prisma.generation.create({
        data: {
          userId: user.id,
          type: toolType,
          prompt: fullPrompt,
          output,
          tokensUsed: output.length,
        },
      }),
      prisma.usageLog.create({
        data: { userId: user.id, action: toolType, creditsUsed: creditsNeeded },
      }),
    ]);

    return NextResponse.json({ output, variations });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
