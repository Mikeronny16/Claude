import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, method } = body as { email?: string; method?: string };

    const id = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const order = {
      id,
      email: (email || "unknown").trim().toLowerCase(),
      method: method || "unknown",
      status: "pending",
      created_at: new Date().toISOString(),
    };

    let blobOk = false;
    let blobError = "";

    try {
      await put(`orders/${id}.json`, JSON.stringify(order), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
      });
      blobOk = true;
    } catch (e) {
      blobError = e instanceof Error ? e.message : String(e);
    }

    // Resend email notification (optional — only if RESEND_API_KEY is set)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ReadyPrompts <onboarding@resend.dev>",
          to: "mikeronny18@gmail.com",
          subject: `🛒 New Order — ${order.method.toUpperCase()} — ${order.email}`,
          html: `<h2>New ReadyPrompts Order</h2>
<p><b>ID:</b> ${order.id}</p>
<p><b>Email:</b> ${order.email}</p>
<p><b>Method:</b> ${order.method}</p>
<p><b>Time:</b> ${new Date(order.created_at).toLocaleString("en-GB", { timeZone: "Asia/Yangon" })} (Yangon)</p>
<hr/>
<p>Reply to buyer: <a href="mailto:${order.email}">${order.email}</a></p>`,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({
      ok: true,
      order_id: id,
      blob_saved: blobOk,
      blob_error: blobError || undefined,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
