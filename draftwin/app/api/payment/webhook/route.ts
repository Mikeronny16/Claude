import { NextRequest, NextResponse } from "next/server";
import { addCredits } from "@/lib/supabase";
import * as crypto from "crypto";

export const dynamic = "force-dynamic";

const CREDIT_MAP: Record<string, number> = {
  starter: 20,
  pro: 70,
  unlimited: 200,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("x-nowpayments-sig") ?? "";

    // Verify HMAC signature from NOWPayments
    const hmac = crypto
      .createHmac("sha512", process.env.NOWPAYMENTS_IPN_SECRET!)
      .update(body)
      .digest("hex");

    if (hmac !== sig) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(body);

    // Only act on confirmed or finished payments
    if (data.payment_status !== "confirmed" && data.payment_status !== "finished") {
      return NextResponse.json({ ok: true });
    }

    // order_id format: userId__packageId__timestamp
    const [userId, packageId] = (data.order_id as string).split("__");
    const credits = CREDIT_MAP[packageId];

    if (!userId || !credits) {
      return NextResponse.json({ error: "Bad order_id" }, { status: 400 });
    }

    await addCredits(userId, credits);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Webhook error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
