import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pass = searchParams.get("pass");

  if (pass !== (process.env.ADMIN_PASSWORD || "rp_admin_2025")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { blobs } = await list({ prefix: "orders/" });

    const orders = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const res = await fetch(blob.url);
          return await res.json();
        } catch {
          return null;
        }
      })
    );

    const valid = orders
      .filter(Boolean)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ orders: valid, count: valid.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg.includes("token") || msg.includes("BLOB")) {
      return NextResponse.json({ orders: [], count: 0, error: "blob_not_configured" });
    }
    return NextResponse.json({ orders: [], count: 0, error: msg });
  }
}
