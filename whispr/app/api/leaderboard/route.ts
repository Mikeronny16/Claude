import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const [usersRes, msgsRes] = await Promise.all([
    supabase.from("whispr_users").select("id, username, display_name, avatar_emoji"),
    supabase.from("whispr_messages").select("recipient_id, sender_mood"),
  ]);

  const users = usersRes.data ?? [];
  const msgs = msgsRes.data ?? [];

  const counts: Record<string, { total: number; moods: Record<string, number> }> = {};
  for (const m of msgs) {
    if (!m.recipient_id) continue;
    if (!counts[m.recipient_id]) counts[m.recipient_id] = { total: 0, moods: {} };
    counts[m.recipient_id].total++;
    if (m.sender_mood) {
      counts[m.recipient_id].moods[m.sender_mood] = (counts[m.recipient_id].moods[m.sender_mood] ?? 0) + 1;
    }
  }

  const leaderboard = users
    .map(u => ({
      username: u.username,
      display_name: u.display_name,
      avatar_emoji: u.avatar_emoji,
      total: counts[u.id]?.total ?? 0,
      topMood: Object.entries(counts[u.id]?.moods ?? {}).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
    }))
    .filter(u => u.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 20);

  return NextResponse.json({ leaderboard });
}
