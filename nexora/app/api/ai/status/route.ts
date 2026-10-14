import { aiConfigured } from "@/lib/ai/server";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ mode: aiConfigured() ? "live" : "demo" }, { headers: { "Cache-Control": "no-store" } });
}
