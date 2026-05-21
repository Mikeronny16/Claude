import { NextRequest, NextResponse } from "next/server";
import { reactToMessage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { messageId, reaction } = await req.json();
  if (!messageId || !reaction) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const ok = await reactToMessage(messageId, reaction);
  return NextResponse.json({ ok });
}
