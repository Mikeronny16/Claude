import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { username } = await req.json();
  if (!username) return NextResponse.json({ ok: false });
  await supabase.from("whispr_views").insert({ username: username.toLowerCase() });
  return NextResponse.json({ ok: true });
}
