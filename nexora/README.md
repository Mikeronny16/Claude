# NEXORA — build your floating world

A teen-focused (ages 12–15) 3D fantasy world-builder prototype. Players shape a floating sky island in real 3D, dream up objects with an AI Creation Studio, and complete creative quests for XP.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · React Three Fiber / drei / three.js · Zustand · Tailwind CSS 4 · Anthropic SDK (optional) · Vitest

## Run it

```bash
cd nexora
npm install
npm run dev          # http://localhost:3000
```

Checks:

```bash
npm run lint
npm run typecheck
npm test             # unit tests (safety filter, AI spec sanitizer, demo generator, quests, store undo/redo)
npm run build
```

### AI Creation Studio: live vs demo mode

| Env var | Effect |
|---|---|
| *(none)* | **Demo mode** (clearly labeled in the UI). Creations are built on the device by a keyword-based generator — the idea never leaves the browser. |
| `ANTHROPIC_API_KEY` | **Live AI.** `/api/ai/create` asks Claude for a JSON model spec via structured outputs; the server validates and clamps every value. |
| `NEXORA_AI_MODEL` | Optional model override. Default `claude-opus-5-5`; `claude-haiku-5-5` is the low-cost option. |

Live mode also enables Anthropic's server-side refusal fallback (`fallbacks: "default"`) for non-Haiku models, and falls back to the demo generator if the API errors. Copy `.env.example` to `.env.local` to configure.

## What's in the app

| Route | What it does |
|---|---|
| `/` | Cinematic landing with a live 3D showcase island |
| `/onboarding` | Welcome → age range (under-12 stops kindly) → made-up explorer name + sigil → island theme + name → safety promise |
| `/world` | My World hub: auto-rotating 3D island, level/XP, today's challenge, island mood (theme) switcher, rename |
| `/builder` | World Builder: tap-to-place on the 3D island (or Auto-place), select by tap or list, 3D move/rotate/scale gizmo, panel nudge controls, colors, duplicate/delete, undo/redo, snap-to-grid, snapshots (save/restore/delete), JSON backup download/load, keyboard shortcuts |
| `/create` | AI Creation Studio: prompt + inspiration chips, safety checks, 3D preview, save / place on island / retry / discard, creations library |
| `/quests` | 12 creative quests + a rotating daily challenge, claim XP, level-ups with item unlocks (Windmill Lv2, Portal Lv3, Rune Stone Lv4) |
| `/explore` | Team-made showcase islands in a 3D viewer, preset reactions, remix into your island (undoable, optional backup snapshot), report flow |
| `/profile` | Explorer card, stats, badges, settings (reduce motion, graphics quality, break reminders, snap to grid) |
| `/privacy` | Plain-language privacy & safety, guardian info, download all data, delete everything |

Builder shortcuts: `W` move · `E` rotate · `R` scale · arrows nudge (Shift = bigger) · `Del` delete · `Ctrl/Cmd+D` duplicate · `Ctrl/Cmd+Z` undo · `Ctrl/Cmd+Shift+Z` or `Ctrl+Y` redo · `Esc` deselect / cancel placing.

## Safety & privacy design (ages 12–15)

- **No accounts, no chat, no ads, no purchases.** Everything is stored in `localStorage` on the device (`nexora-v1`); only an age *range* is kept.
- **Text filter** (`lib/safety.ts`) on names, titles and AI prompts, client- and server-side: blocked words (with leetspeak/spacing/stretching tricks), and personal info (emails, phone numbers, links, addresses, social handles, "add me on…").
- **AI output is untrusted:** the spec is schema-constrained, then every number/color/shape is clamped and names/descriptions re-filtered (`lib/ai/spec.ts`). The prompt is wrapped as data, not instructions.
- **API route hardening:** same-origin check, body size cap, per-IP rate limit (12 / 10 min), daily client quota in live mode (15/day), `server-only` key handling, `force-dynamic`, no-store.
- **Healthy-use features:** optional break reminders, reduce-motion (also follows the OS setting), no punishing streaks.

## Architecture

```
app/                    routes (all client pages except landing shell) + api/ai/{status,create}
components/three/       WorldScene (Canvas, gizmo, placement), Island (procedural terrain, sky), models (17 assets + AI parts renderer), SceneLoader (lazy, WebGL fallback)
components/builder/     Add / Edit / Objects / Saves panels
components/ui/          Dialog (native <dialog>), Toasts, LevelUp, QuestIcon
lib/store.ts            Zustand store: world, history (undo/redo), snapshots, creations, progress, settings; persisted + sanitized on load
lib/ai/                 spec schema + sanitizer, offline demo generator, server-only Claude call
lib/quests.ts, levels.ts, safety.ts, world.ts, showcase.ts, catalog.ts
tests/                  Vitest unit tests
```

## Status — honest

**Working and verified** (unit tests + Playwright walkthroughs at 390 px and 1440 px on a production build, zero console errors):
onboarding incl. under-12 stop and name filtering · route gating · tap-to-place on the 3D island · gizmo translate/rotate/scale (uniform) committing to the store · undo/redo (buttons + keys) · panel edits · duplicate/delete · object list · snapshots save/restore (restore is undoable) · reload persistence · quest claiming + level-up dialog · demo-mode AI creation + placement · unsafe/PII prompt blocking · explore visit/react/report · settings · data download · delete everything · no horizontal overflow at 320/390 px.

**Not done / limitations**
- Live Claude mode is implemented and type-checked but **not exercised against the real API** here (no key in this environment).
- Explore shows **team-made showcase islands only**; real player sharing, server-side moderation and a reports queue need a backend.
- Rate limiting is in-memory per server instance; production needs a shared store (e.g. Redis/Upstash).
- Age gate is self-declared; there is no verifiable parental consent flow (needed for any real launch with accounts/sharing, e.g. COPPA/GDPR-K).
- The word filter is a first line of defense, not production moderation.
- Data lives only in the browser; clearing site data loses it (backup download is available).
- No automated browser tests are checked in (the Playwright walkthroughs were run ad hoc); no audio.
- The `NEXORA_Product_Blueprint_Claude_Prompt.md` referenced in the build request was not available in the repo, so its acceptance criteria could not be checked line by line.

## Deploy

On Vercel, create a project with **Root Directory = `nexora`** (framework: Next.js). Add `ANTHROPIC_API_KEY` only if you want live AI.
