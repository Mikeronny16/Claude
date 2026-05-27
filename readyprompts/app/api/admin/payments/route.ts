import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pass = searchParams.get("pass");

  if (pass !== (process.env.ADMIN_PASSWORD || "rp_admin_2025")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Manual payment flow — Wave/KBZ payments tracked via email
  return NextResponse.json({ payments: [], total_usd: 0, count: 0, note: "Manual payment flow active" });
}
