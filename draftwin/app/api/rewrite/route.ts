import { NextRequest, NextResponse } from "next/server";
import { deductCredit, getCredits, ensureUser } from "@/lib/supabase";
import { rewriteProposal } from "@/lib/groq";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId, oldProposal, feedback } = await req.json();
    if (!userId || !oldProposal) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await ensureUser(userId);
    const ok = await deductCredit(userId);
    if (!ok) return NextResponse.json({ error: "No credits" }, { status: 402 });

    const result = await rewriteProposal({ oldProposal, feedback });
    const creditsLeft = await getCredits(userId);

    return NextResponse.json({ ...result, creditsLeft });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
