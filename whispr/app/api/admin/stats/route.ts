import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export const dynamic = "force-dynamic";

function daysBefore(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export async function GET(req: NextRequest) {
  const pwd = req.nextUrl.searchParams.get("pwd");
  if (pwd !== process.env.WHISPR_ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const [
    usersRes, usersTodayRes, usersWeekRes,
    msgsRes, msgsTodayRes, msgsWeekRes,
    viewsRes, viewsTodayRes,
    topUsersRes, recentUsersRes,
    dailyMsgsRes, dailyUsersRes,
  ] = await Promise.all([
    supabase.from("whispr_users").select("*", { count: "exact", head: true }),
    supabase.from("whispr_users").select("*", { count: "exact", head: true }).gte("created_at", todayStart),
    supabase.from("whispr_users").select("*", { count: "exact", head: true }).gte("created_at", daysBefore(7)),
    supabase.from("whispr_messages").select("*", { count: "exact", head: true }),
    supabase.from("whispr_messages").select("*", { count: "exact", head: true }).gte("created_at", todayStart),
    supabase.from("whispr_messages").select("*", { count: "exact", head: true }).gte("created_at", daysBefore(7)),
    supabase.from("whispr_views").select("*", { count: "exact", head: true }),
    supabase.from("whispr_views").select("*", { count: "exact", head: true }).gte("created_at", todayStart),
    supabase.from("whispr_messages").select("recipient_id").gte("created_at", daysBefore(30)),
    supabase.from("whispr_users").select("id, username, display_name, avatar_emoji, created_at").order("created_at", { ascending: false }).limit(10),
    supabase.from("whispr_messages").select("created_at").gte("created_at", daysBefore(7)).order("created_at", { ascending: true }),
    supabase.from("whispr_users").select("created_at").gte("created_at", daysBefore(7)).order("created_at", { ascending: true }),
  ]);

  // Build daily chart data (last 7 days)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const msgsByDay = days.map(day => ({
    day,
    count: (dailyMsgsRes.data ?? []).filter(m => m.created_at.slice(0, 10) === day).length,
  }));
  const usersByDay = days.map(day => ({
    day,
    count: (dailyUsersRes.data ?? []).filter(u => u.created_at.slice(0, 10) === day).length,
  }));

  // Count messages per recipient
  const recipientCounts: Record<string, number> = {};
  for (const m of topUsersRes?.data ?? []) {
    const rid = (m as unknown as { recipient_id: string }).recipient_id;
    if (rid) recipientCounts[rid] = (recipientCounts[rid] ?? 0) + 1;
  }

  const topUsers = (recentUsersRes.data ?? [])
    .map(u => ({ ...u, msgCount: recipientCounts[u.id] ?? 0 }))
    .sort((a, b) => b.msgCount - a.msgCount)
    .slice(0, 5);

  return NextResponse.json({
    users: { total: usersRes.count ?? 0, today: usersTodayRes.count ?? 0, week: usersWeekRes.count ?? 0 },
    messages: { total: msgsRes.count ?? 0, today: msgsTodayRes.count ?? 0, week: msgsWeekRes.count ?? 0 },
    views: { total: viewsRes.count ?? 0, today: viewsTodayRes.count ?? 0 },
    msgsByDay,
    usersByDay,
    recentUsers: recentUsersRes.data ?? [],
    topUsers,
  });
}
