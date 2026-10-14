import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { CreationSpec } from "../types";
import { CREATION_JSON_SCHEMA, CREATION_SYSTEM_PROMPT, sanitizeSpec } from "./spec";

/** Default model; override with NEXORA_AI_MODEL (e.g. claude-haiku-5-5 for lower cost). */
const DEFAULT_MODEL = "claude-opus-5-5";

export function aiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export type LiveResult = { ok: true; spec: CreationSpec } | { ok: false; reason: "refusal" | "invalid" };

/**
 * Asks Claude for a creation spec using structured outputs, then validates
 * and clamps it. Throws on network/API errors so the caller can fall back.
 */
export async function createWithClaude(prompt: string): Promise<LiveResult> {
  const model = process.env.NEXORA_AI_MODEL?.trim() || DEFAULT_MODEL;
  const client = new Anthropic({ timeout: 45_000, maxRetries: 1 });
  // Keep the idea inside its tags: strip anything that could close them.
  const idea = prompt.replace(/[<>]/g, " ");

  const params: Anthropic.Beta.Messages.MessageCreateParamsNonStreaming = {
    model,
    max_tokens: 16000,
    system: CREATION_SYSTEM_PROMPT,
    messages: [{ role: "user", content: `<idea>${idea}</idea>` }],
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: CREATION_JSON_SCHEMA as unknown as Record<string, unknown> },
    },
  };
  // Server-side fallback re-runs a safety-declined request on Anthropic's
  // recommended model. Haiku has no server-side fallback, so skip it there.
  if (!model.startsWith("claude-haiku")) {
    params.betas = ["server-side-fallback-2026-07-01"];
    params.fallbacks = "default";
  }

  const response = await client.beta.messages.create(params);
  if (response.stop_reason === "refusal") return { ok: false, reason: "refusal" };
  const text = response.content.find((b): b is Anthropic.Beta.Messages.BetaTextBlock => b.type === "text")?.text;
  if (!text) return { ok: false, reason: "invalid" };
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, reason: "invalid" };
  }
  const spec = sanitizeSpec(raw, prompt);
  return spec ? { ok: true, spec } : { ok: false, reason: "invalid" };
}
