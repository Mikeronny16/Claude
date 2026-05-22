import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!apiKey || apiKey === "placeholder_key") {
    return NextResponse.json({ error: "Payment not configured", detail: "Missing API key" }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: 2,
        price_currency: "usd",
        order_id: `rp_${Date.now()}`,
        order_description: "ReadyPrompts — 105 Ultimate AI Prompt Kit",
        success_url: `${appUrl}/thank-you`,
        cancel_url: `${appUrl}/?cancelled=1`,
        is_fixed_rate: false,
        is_fee_paid_by_user: false,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("NOWPayments error:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Payment creation failed", detail: data?.message || data?.error || JSON.stringify(data) },
        { status: 500 }
      );
    }

    return NextResponse.json({
      invoice_url: data.invoice_url,
      payment_id: data.id,
    });
  } catch (err) {
    console.error("Payment create error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
