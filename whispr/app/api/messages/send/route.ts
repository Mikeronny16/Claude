import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername, sendMessage } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { username, content, senderMood } = await req.json();

  if (!username || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (content.trim().length > 500) {
    return NextResponse.json({ error: "Message too long (max 500 chars)" }, { status: 400 });
  }

  const user = await getUserByUsername(username);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const ok = await sendMessage(user.id, content.trim(), senderMood ?? null);
  if (!ok) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
