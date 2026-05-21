import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pass = searchParams.get("pass");

  if (pass !== (process.env.ADMIN_PASSWORD || "rp_admin_2025")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey || apiKey === "placeholder_key") {
    return NextResponse.json({ payments: [], total_usd: 0, count: 0 });
  }

  try {
    const res = await fetch(
      "https://api.nowpayments.io/v1/payment/?limit=100&sortBy=created_at&orderBy=desc",
      {
        headers: { "x-api-key": apiKey },
        cache: "no-store",
      }
    );

    const data = await res.json();
    const payments = data.data || [];

    const finishedPayments = payments.filter((p: { payment_status: string }) =>
      ["finished", "confirmed", "partially_paid"].includes(p.payment_status)
    );

    const totalUsd = finishedPayments.reduce(
      (sum: number, p: { price_amount?: number }) => sum + (p.price_amount || 2),
      0
    );

    return NextResponse.json({
      payments: payments.slice(0, 50),
      total_usd: totalUsd,
      count: finishedPayments.length,
      total_count: payments.length,
    });
  } catch (err) {
    console.error("Admin payments error:", err);
    return NextResponse.json({ payments: [], total_usd: 0, count: 0, error: "API error" });
  }
}
