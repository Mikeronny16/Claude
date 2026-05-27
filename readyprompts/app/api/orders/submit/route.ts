import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, method } = body as { email?: string; name?: string; method?: string };

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const id = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const order = {
      id,
      email: email.trim().toLowerCase(),
      name: (name || "").trim(),
      method: method || "unknown",
      status: "pending",
      created_at: new Date().toISOString(),
    };

    await put(`orders/${id}.json`, JSON.stringify(order), {
      access: "public",
      contentType: "application/json",
    });

    return NextResponse.json({ ok: true, order_id: id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
