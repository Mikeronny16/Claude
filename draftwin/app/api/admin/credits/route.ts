import { NextRequest, NextResponse } from "next/server";
import { addCredits, ensureUser } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId, amount, adminPassword } = await req.json();

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    await ensureUser(userId);
    await addCredits(userId, amount);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
