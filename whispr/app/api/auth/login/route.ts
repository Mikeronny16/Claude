import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByUsernameWithPassword } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await getUserByUsernameWithPassword(username);
  if (!user) {
    return NextResponse.json({ error: "Username not found" }, { status: 404 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    user: { id: user.id, username: user.username, displayName: user.display_name, avatarEmoji: user.avatar_emoji },
  });
}
