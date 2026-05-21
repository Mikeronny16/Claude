import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PACKAGES = {
  starter: { usd: 5, credits: 20, label: "Starter" },
  pro: { usd: 15, credits: 70, label: "Pro" },
  unlimited: { usd: 39, credits: 200, label: "Unlimited" },
} as const;

export async function POST(req: NextRequest) {
  try {
    const { userId, packageId } = await req.json();
    const pkg = PACKAGES[packageId as keyof typeof PACKAGES];

    if (!pkg || !userId) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    const res = await fetch("https://api.nowpayments.io/v1/payment", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: pkg.usd,
        price_currency: "usd",
        pay_currency: "usdtbsc",
        order_id: `${userId}__${packageId}__${Date.now()}`,
        order_description: `DraftWin ${pkg.label} — ${pkg.credits} credits`,
        ipn_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Payment creation failed");

    return NextResponse.json({
      paymentId: data.payment_id,
      payAddress: data.pay_address,
      payAmount: data.pay_amount,
      payCurrency: data.pay_currency,
      credits: pkg.credits,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
