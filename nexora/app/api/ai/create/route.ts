import { demoCreate } from "@/lib/ai/demo";
import { aiConfigured, createWithClaude } from "@/lib/ai/server";
import { PROMPT_MAX, PROMPT_MIN } from "@/lib/ai/spec";
import { checkText } from "@/lib/safety";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 12;
// Best-effort, per-server-instance limit. A shared store (e.g. Redis) is needed for a real launch.
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t > WINDOW_MS)) hits.delete(k);
  }
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    if (origin && host && new URL(origin).host !== host) return json({ error: "forbidden", message: "Requests must come from NEXORA." }, 403);
  } catch {
    return json({ error: "forbidden", message: "Requests must come from NEXORA." }, 403);
  }
  if (Number(req.headers.get("content-length") ?? 0) > 4096) return json({ error: "too-large", message: "That request is too big." }, 413);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad-request", message: "Something went wrong sending your idea." }, 400);
  }
  const prompt = typeof (body as { prompt?: unknown })?.prompt === "string" ? (body as { prompt: string }).prompt.trim() : "";
  const safety = checkText(prompt, { min: PROMPT_MIN, max: PROMPT_MAX });
  if (!safety.ok) return json({ error: safety.code, message: safety.message }, 422);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return json({ error: "rate-limited", message: "You're creating super fast! Take a short break and try again in a few minutes." }, 429);
  }

  if (!aiConfigured()) {
    return json({ mode: "demo", spec: demoCreate(prompt), notice: "No AI service is connected, so the demo generator built this." });
  }

  try {
    const result = await createWithClaude(prompt);
    if (result.ok) return json({ mode: "live", spec: result.spec });
    if (result.reason === "refusal") {
      return json({ error: "refusal", message: "That idea can't be built in NEXORA. Try something different!" }, 422);
    }
    return json({ mode: "demo", spec: demoCreate(prompt), notice: "The AI's answer didn't fit, so the demo generator built this instead." });
  } catch (err) {
    console.error("[nexora] AI creation failed:", err instanceof Error ? err.message : err);
    return json({ mode: "demo", spec: demoCreate(prompt), notice: "The AI service didn't answer, so the demo generator built this instead." });
  }
}
