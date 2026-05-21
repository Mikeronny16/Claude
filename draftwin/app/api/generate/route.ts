import { NextRequest, NextResponse } from "next/server";
import { generateProposal } from "@/lib/groq";
import { getCredits, deductCredit, ensureUser } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, skills, projectDesc, yourName, clientName, tone } = body;

    if (!userId || !skills || !projectDesc || !yourName || !clientName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await ensureUser(userId);
    const credits = await getCredits(userId);

    if (credits <= 0) {
      return NextResponse.json({ error: "No credits left", needsPurchase: true }, { status: 402 });
    }

    const ok = await deductCredit(userId);
    if (!ok) {
      return NextResponse.json({ error: "No credits left", needsPurchase: true }, { status: 402 });
    }

    const proposal = await generateProposal({ skills, projectDesc, yourName, clientName, tone: tone ?? "professional" });
    const remaining = credits - 1;

    return NextResponse.json({ proposal, creditsLeft: remaining });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Generate error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
