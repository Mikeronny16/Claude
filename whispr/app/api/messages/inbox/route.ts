import { NextRequest, NextResponse } from "next/server";
import { getUserById, getMessages, getMessageStats } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const user = await getUserById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const [messages, stats] = await Promise.all([
    getMessages(userId),
    getMessageStats(userId),
  ]);

  return NextResponse.json({ messages, stats, user });
}
