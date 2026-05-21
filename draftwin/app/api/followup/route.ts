import { NextRequest, NextResponse } from "next/server";
import { deductCredit, getCredits, ensureUser } from "@/lib/supabase";
import { generateFollowUp } from "@/lib/groq";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId, originalProposal, clientName, yourName, daysSince } = await req.json();
    if (!userId || !originalProposal) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await ensureUser(userId);
    const ok = await deductCredit(userId);
    if (!ok) return NextResponse.json({ error: "No credits" }, { status: 402 });

    const followUp = await generateFollowUp({
      originalProposal,
      clientName: clientName ?? "the client",
      yourName: yourName ?? "there",
      daysSince: daysSince ?? 3,
    });
    const creditsLeft = await getCredits(userId);

    return NextResponse.json({ followUp, creditsLeft });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
