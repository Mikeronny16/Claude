"use client";

import { Bot, Info, LoaderCircle, MapPin, RefreshCw, Save, ShieldCheck, Trash2, WandSparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AssetGlyph } from "@/components/builder/AssetTile";
import { ConfirmDialog } from "@/components/ui/Dialog";
import { CreationView } from "@/components/three/SceneLoader";
import { demoCreate } from "@/lib/ai/demo";
import { PROMPT_MAX, PROMPT_MIN, sanitizeSpec } from "@/lib/ai/spec";
import { DAILY_AI_LIMIT } from "@/lib/catalog";
import { useReducedMotion } from "@/lib/hooks";
import { dayKey } from "@/lib/quests";
import { checkText } from "@/lib/safety";
import { useNexora } from "@/lib/store";
import type { CreationSource, CreationSpec } from "@/lib/types";

type Mode = "checking" | "live" | "demo";

const IDEAS = [
  "a glowing crystal tower",
  "a sleepy moon lantern",
  "a friendly cloud dragon",
  "a candy mushroom house",
  "a tiny golden rocket",
  "a spinning planet with rings",
  "a robot gardener",
  "an ice flower that glows",
];

interface Draft {
  prompt: string;
  spec: CreationSpec;
  source: CreationSource;
  notice?: string;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function CreateStudio() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const quality = useNexora((s) => s.settings.quality);
  const creations = useNexora((s) => s.creations);
  const aiUsage = useNexora((s) => s.aiUsage);
  const { addCreation, deleteCreation, recordAiUse, addObject, pushToast } = useNexora.getState();

  const [mode, setMode] = useState<Mode>("checking");
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const resultRef = useRef<HTMLElement>(null);

  // On phones the result sits below the form: bring it into view when work starts.
  const revealResult = () => {
    const el = resultRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 0 || r.top > window.innerHeight * 0.6) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  useEffect(() => {
    let alive = true;
    fetch("/api/ai/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { mode: "demo" }))
      .then((d: { mode?: string }) => alive && setMode(d.mode === "live" ? "live" : "demo"))
      .catch(() => alive && setMode("demo"));
    return () => {
      alive = false;
    };
  }, []);

  const usesLeft = aiUsage.day === dayKey() ? Math.max(0, DAILY_AI_LIMIT - aiUsage.count) : DAILY_AI_LIMIT;
  const outOfUses = mode === "live" && usesLeft <= 0;

  const generate = async (text = prompt) => {
    const idea = text.trim();
    const check = checkText(idea, { min: PROMPT_MIN, max: PROMPT_MAX });
    if (!check.ok) {
      setError(check.message);
      return;
    }
    if (outOfUses) {
      setError(`You've used all ${DAILY_AI_LIMIT} AI creations for today. They refresh tomorrow — try building by hand meanwhile!`);
      return;
    }
    setError(null);
    setBusy(true);
    setDraft(null);
    requestAnimationFrame(revealResult);
    try {
      if (mode === "live") {
        recordAiUse();
        const res = await fetch("/api/ai/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: idea }),
        });
        const data = (await res.json().catch(() => ({}))) as { mode?: string; spec?: unknown; notice?: string; message?: string };
        if (!res.ok) {
          setError(data.message ?? "Something went wrong. Please try again.");
          return;
        }
        const spec = sanitizeSpec(data.spec, idea);
        if (!spec) throw new Error("bad spec");
        setDraft({ prompt: idea, spec, source: data.mode === "live" ? "live" : "demo", notice: data.notice });
      } else {
        // Demo mode runs on this device: the idea never leaves the browser.
        await wait(reduced ? 150 : 900);
        setDraft({ prompt: idea, spec: demoCreate(idea), source: "demo" });
      }
    } catch {
      await wait(200);
      setDraft({ prompt: idea, spec: demoCreate(idea), source: "demo", notice: "Couldn't reach the AI service, so the demo generator built this on your device." });
    } finally {
      setBusy(false);
    }
  };

  const keep = (place: boolean) => {
    if (!draft) return;
    const c = addCreation(draft.prompt, draft.spec, draft.source);
    setDraft(null);
    setPrompt("");
    if (place) {
      const id = addObject("custom", { creationId: c.id });
      if (id) router.push("/builder");
    } else {
      pushToast({ tone: "success", title: `${c.spec.name} saved`, body: "Find it in the Builder under “My creations”." });
    }
  };

  const remaining = PROMPT_MAX - prompt.length;
  const toDelete = creations.find((c) => c.id === deleteId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">
            AI Creation <span className="text-gradient">Studio</span>
          </h1>
          <p className="mt-1 text-sm text-dim">Describe something and it becomes a 3D object for your island.</p>
        </div>
        <div aria-live="polite">
          {mode === "checking" ? (
            <span className="chip">Checking AI…</span>
          ) : mode === "live" ? (
            <span className="chip chip-cyan">
              <Bot size={13} aria-hidden /> Live AI · {usesLeft}/{DAILY_AI_LIMIT} left today
            </span>
          ) : (
            <span className="chip chip-gold">
              <Info size={13} aria-hidden /> Demo mode
            </span>
          )}
        </div>
      </div>

      {mode === "demo" && (
        <div className="panel mt-4 flex gap-3 border-amber-300/40 p-4 text-sm" role="note">
          <Info size={20} className="mt-0.5 shrink-0 text-amber-200" aria-hidden />
          <p className="text-dim">
            <strong className="text-amber-100">Demo mode:</strong> no AI service is connected right now, so creations are built by a simple generator on your device from keywords in your idea
            (things like <em>tower, dragon, crystal, red, giant, floating</em>). Results are simpler than real AI, and your idea never leaves this device.
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="panel p-4 sm:p-5" aria-labelledby="idea-h">
          <h2 id="idea-h" className="font-bold">
            Your idea
          </h2>
          <form
            className="mt-3"
            onSubmit={(e) => {
              e.preventDefault();
              void generate();
            }}
          >
            <label htmlFor="idea" className="sr-only">
              Describe what you want to create
            </label>
            <textarea
              id="idea"
              className="input min-h-28 resize-none"
              value={prompt}
              maxLength={PROMPT_MAX}
              placeholder="e.g. a glowing crystal tower with tiny lanterns"
              aria-invalid={!!error}
              aria-describedby="idea-help idea-error"
              onChange={(e) => {
                setPrompt(e.target.value);
                if (error) setError(null);
              }}
            />
            <div className="mt-1.5 flex justify-between gap-2 text-xs">
              <span id="idea-help" className="text-faint">
                Describe shapes, colors and mood. Don&apos;t include personal info.
              </span>
              <span className={remaining < 20 ? "text-amber-200" : "text-faint"} aria-label={`${remaining} characters left`}>
                {remaining}
              </span>
            </div>
            <p id="idea-error" className="field-error mt-2 min-h-5" role="alert">
              {error}
            </p>
            <button type="submit" className="btn btn-gold mt-1 w-full" disabled={busy || mode === "checking"} aria-disabled={outOfUses}>
              {busy ? <LoaderCircle size={18} className="animate-spin" aria-hidden /> : <WandSparkles size={18} aria-hidden />}
              {busy ? "Shaping your idea…" : "Create"}
            </button>
          </form>
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-faint">Need inspiration?</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {IDEAS.map((idea) => (
                <li key={idea}>
                  <button
                    type="button"
                    className="chip min-h-9 hover:border-violet-300/60"
                    onClick={() => {
                      setPrompt(idea);
                      setError(null);
                    }}
                  >
                    {idea}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-5 flex gap-2 text-xs text-faint">
            <ShieldCheck size={16} className="shrink-0 text-cyan-300" aria-hidden />
            {mode === "live"
              ? "Your idea (and nothing else about you) is sent to an AI service to design the model. Unkind or unsafe ideas are blocked. AI can make mistakes — if something looks wrong, just delete it."
              : "Unkind or unsafe ideas are blocked. If anything ever feels wrong, talk to a trusted adult."}
          </p>
        </section>

        <section ref={resultRef} className="panel relative min-h-[22rem] scroll-mt-20 overflow-hidden" aria-labelledby="result-h" aria-busy={busy}>
          <h2 id="result-h" className="sr-only">
            Result
          </h2>
          {busy ? (
            <div className="flex h-full min-h-[22rem] flex-col items-center justify-center gap-4 p-6 text-center" role="status">
              <div className="shimmer size-32 rounded-full" aria-hidden />
              <p className="text-sm text-dim">Shaping “{prompt.trim()}”…</p>
            </div>
          ) : draft ? (
            <div className="flex h-full flex-col">
              <div className="relative h-72 sm:h-80">
                <CreationView spec={draft.spec} reducedMotion={reduced} quality={quality} label={`3D preview of ${draft.spec.name}: ${draft.spec.description}`} />
                <span className={`chip absolute left-3 top-3 ${draft.source === "live" ? "chip-cyan" : "chip-gold"}`}>
                  {draft.source === "live" ? "Made with AI" : "Demo generator"}
                </span>
              </div>
              <div className="p-4">
                <p className="font-display text-xl">{draft.spec.name}</p>
                <p className="mt-1 text-sm text-dim">{draft.spec.description}</p>
                {draft.notice && <p className="mt-2 text-xs text-amber-200">{draft.notice}</p>}
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <button type="button" className="btn btn-gold col-span-2" onClick={() => keep(true)}>
                    <MapPin size={17} aria-hidden /> Place on my island
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => keep(false)}>
                    <Save size={16} aria-hidden /> Save
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => void generate(draft.prompt)} disabled={outOfUses}>
                    <RefreshCw size={16} aria-hidden /> Retry
                  </button>
                </div>
                <button type="button" className="mt-2 inline-flex min-h-9 items-center gap-1 text-sm text-faint hover:text-white" onClick={() => setDraft(null)}>
                  <X size={14} aria-hidden /> Discard
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[22rem] flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="animate-float grid size-24 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#c4b5fd,#6d28d9_55%,#1e1b4b_80%)] shadow-[0_0_60px_rgba(139,92,246,0.5)]">
                <WandSparkles size={34} className="text-amber-200" aria-hidden />
              </div>
              <p className="font-display text-lg">Your creation appears here</p>
              <p className="max-w-xs text-sm text-dim">Type an idea or tap an inspiration chip, then press Create.</p>
            </div>
          )}
        </section>
      </div>

      <section className="mt-6" aria-labelledby="library-h">
        <h2 id="library-h" className="font-bold">
          My creations <span className="text-faint">({creations.length})</span>
        </h2>
        {creations.length === 0 ? (
          <p className="mt-2 text-sm text-faint">Creations you save will show up here and in the World Builder.</p>
        ) : (
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {creations.map((c) => (
              <li key={c.id} className="panel flex items-center gap-3 p-3">
                <AssetGlyph kind="custom" color={c.spec.parts.find((p) => p.glow)?.color ?? c.spec.parts[0].color} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{c.spec.name}</p>
                  <p className="truncate text-xs text-faint">
                    {c.source === "live" ? "AI" : "Demo"} · “{c.prompt}”
                  </p>
                </div>
                <button
                  type="button"
                  className="icon-btn size-10!"
                  aria-label={`Place ${c.spec.name} on my island`}
                  title="Place on my island"
                  onClick={() => {
                    if (addObject("custom", { creationId: c.id })) router.push("/builder");
                  }}
                >
                  <MapPin size={16} aria-hidden />
                </button>
                <button type="button" className="icon-btn size-10!" aria-label={`Delete ${c.spec.name}`} onClick={() => setDeleteId(c.id)}>
                  <Trash2 size={16} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteCreation(deleteId)}
        danger
        title={`Delete ${toDelete?.spec.name ?? "creation"}?`}
        description="It will be removed from your library and from your island. Island changes can be undone in the Builder; the creation itself can't."
        confirmLabel="Delete"
      />
    </div>
  );
}
