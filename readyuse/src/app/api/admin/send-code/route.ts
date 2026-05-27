import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { pass, email } = await request.json();

  if (pass !== (process.env.ADMIN_PASSWORD || "ru_admin_2025")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const paymentId = `RU-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const secret = process.env.DOWNLOAD_SECRET || "ru_secret_2025";

  const encoder = new TextEncoder();
  const data = encoder.encode(paymentId + secret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const token = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://readyuse.vercel.app";
  const downloadUrl = `${appUrl}/api/download?payment_id=${paymentId}&token=${token}&file=bundle-all`;

  return NextResponse.json({ paymentId, token, downloadUrl, email });
}
