import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername, getMessageStats } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const stats = await getMessageStats(user.id);
  return NextResponse.json({ user, totalMessages: stats.total });
}
