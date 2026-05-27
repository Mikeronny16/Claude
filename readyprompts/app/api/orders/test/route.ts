import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pass = searchParams.get("pass");

  if (pass !== (process.env.ADMIN_PASSWORD || "rp_admin_2025")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, unknown> = {
    token_set: !!process.env.BLOB_READ_WRITE_TOKEN,
    token_prefix: process.env.BLOB_READ_WRITE_TOKEN?.slice(0, 20) + "...",
  };

  try {
    const testId = `TEST-${Date.now()}`;
    const blob = await put(`orders/${testId}.json`, JSON.stringify({ id: testId, test: true, created_at: new Date().toISOString() }), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    results.write_ok = true;
    results.blob_url = blob.url;
  } catch (e) {
    results.write_ok = false;
    results.write_error = e instanceof Error ? e.message : String(e);
  }

  try {
    const { blobs } = await list({ prefix: "orders/" });
    results.list_ok = true;
    results.blob_count = blobs.length;
    results.blobs = blobs.map(b => b.pathname);
  } catch (e) {
    results.list_ok = false;
    results.list_error = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json(results);
}
