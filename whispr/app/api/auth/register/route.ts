import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, getUserByUsername } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export async function POST(req: NextRequest) {
  const { username, displayName, avatarEmoji, password } = await req.json();

  if (!username || !password || !displayName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!USERNAME_RE.test(username.toLowerCase())) {
    return NextResponse.json({ error: "Username must be 3-20 chars, letters/numbers/underscore only" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const existing = await getUserByUsername(username);
  if (existing) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await createUser(username, displayName, avatarEmoji ?? "👤", hash);

  if (!user) {
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, user: { id: user.id, username: user.username, displayName: user.display_name, avatarEmoji: user.avatar_emoji } });
}
