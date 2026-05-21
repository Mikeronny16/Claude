import { NextRequest, NextResponse } from "next/server";
import { replyToMessage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { messageId, reply } = await req.json();
  if (!messageId || !reply?.trim()) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  if (reply.trim().length > 300) return NextResponse.json({ error: "Reply too long" }, { status: 400 });

  const ok = await replyToMessage(messageId, reply.trim());
  return NextResponse.json({ ok });
}
