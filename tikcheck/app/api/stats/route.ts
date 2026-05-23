import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/track`, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data);
}
