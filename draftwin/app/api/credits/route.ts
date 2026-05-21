import { NextRequest, NextResponse } from "next/server";
import { getCredits, ensureUser } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) return NextResponse.json({ credits: 0 });

  await ensureUser(userId);
  const credits = await getCredits(userId);
  return NextResponse.json({ credits });
}
