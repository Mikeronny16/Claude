import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ streak: 0 });

  const today = new Date().toISOString().slice(0, 10);

  const { data: existing } = await supabase
    .from("whispr_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!existing) {
    await supabase.from("whispr_streaks").insert({ user_id: userId, last_login: today, streak_count: 1 });
    return NextResponse.json({ streak: 1, isNew: true });
  }

  const last = existing.last_login;
  if (last === today) {
    return NextResponse.json({ streak: existing.streak_count });
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const newStreak = last === yesterdayStr ? existing.streak_count + 1 : 1;

  await supabase.from("whispr_streaks").update({ last_login: today, streak_count: newStreak }).eq("user_id", userId);
  return NextResponse.json({ streak: newStreak, extended: last === yesterdayStr });
}
