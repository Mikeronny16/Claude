import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("payment_id");

  if (!paymentId) {
    return NextResponse.json({ error: "Missing payment_id" }, { status: 400 });
  }

  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey || apiKey === "placeholder_key") {
    return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(
      `https://api.nowpayments.io/v1/payment/${paymentId}`,
      {
        headers: { "x-api-key": apiKey },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: "Status check failed" }, { status: 500 });
    }

    const paid =
      data.payment_status === "finished" ||
      data.payment_status === "confirmed" ||
      data.payment_status === "partially_paid";

    return NextResponse.json({
      status: data.payment_status,
      paid,
      payment_id: paymentId,
    });
  } catch (err) {
    console.error("Status check error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
