import { NextRequest, NextResponse } from "next/server";
import { addCredits, userExists, ensureUser } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { newUserId, refUserId } = await req.json();
    if (!newUserId || !refUserId || newUserId === refUserId) {
      return NextResponse.json({ ok: false });
    }

    await ensureUser(newUserId);
    const refExists = await userExists(refUserId);
    if (!refExists) return NextResponse.json({ ok: false });

    await Promise.all([
      addCredits(refUserId, 2),
      addCredits(newUserId, 1),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
