import { NextRequest, NextResponse } from "next/server";

// In-memory store — resets on cold start but works without DB
const counts: Record<string, number> = {};
const daily: Record<string, Record<string, number>> = {};

export async function POST(req: NextRequest) {
  const { tool } = await req.json();
  if (!tool) return NextResponse.json({ ok: false });

  counts[tool] = (counts[tool] ?? 0) + 1;
  counts["__total__"] = (counts["__total__"] ?? 0) + 1;

  const today = new Date().toISOString().split("T")[0];
  if (!daily[today]) daily[today] = {};
  daily[today][tool] = (daily[today][tool] ?? 0) + 1;

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ counts, daily });
}
