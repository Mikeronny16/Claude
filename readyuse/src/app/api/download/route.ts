import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Maps template slug + platform to the actual workflow file
const WORKFLOW_FILES: Record<string, string> = {
  "telegram-ai-bot-n8n": "telegram-ai-bot-n8n.json",
  "telegram-ai-bot-make": "telegram-ai-bot-make.json",
  "social-media-autoposter-n8n": "social-media-autoposter-n8n.json",
  "social-media-autoposter-make": "social-media-autoposter-make.json",
  "business-automation-n8n": "business-automation-n8n.json",
  "business-automation-make": "business-automation-make.json",
  "lead-gen-crm-n8n": "lead-gen-crm-n8n.json",
  "lead-gen-crm-make": "lead-gen-crm-make.json",
  // bundle = all files zipped (served as JSON index for now)
  "bundle-all": "bundle-all",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("payment_id");
  const token = searchParams.get("token");
  const fileKey = searchParams.get("file") || "bundle-all";

  if (!paymentId || !token) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  // Verify token: sha256(paymentId + DOWNLOAD_SECRET)
  const secret = process.env.DOWNLOAD_SECRET || "ru_secret_2025";
  const encoder = new TextEncoder();
  const data = encoder.encode(paymentId + secret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const expectedToken = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (token !== expectedToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  // Serve requested file
  const fileName = WORKFLOW_FILES[fileKey];
  if (!fileName) {
    return NextResponse.json({ error: "Unknown file" }, { status: 404 });
  }

  if (fileKey === "bundle-all") {
    // Return a JSON index of all download URLs for the bundle
    const baseUrl = new URL(request.url).origin;
    const bundleIndex = {
      name: "Readyuse — Complete Bundle (n8n + Make.com)",
      files: Object.keys(WORKFLOW_FILES)
        .filter(k => k !== "bundle-all")
        .map(k => ({
          name: k,
          url: `${baseUrl}/api/download?payment_id=${paymentId}&token=${token}&file=${k}`,
        })),
      instructions: "Download each file and import into n8n or Make.com. See the setup guide included in your purchase email.",
    };
    return new NextResponse(JSON.stringify(bundleIndex, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="Readyuse-Bundle-Index.json"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const filePath = path.join(process.cwd(), "src/lib/workflow-files", fileName);
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
