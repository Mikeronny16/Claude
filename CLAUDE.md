# Claude Code Instructions — Mike Ronny Projects Monorepo

> **Read `MIKE_CONTEXT.md` FIRST in every new session.** It has Mike's preferences, the default design system, and the full project/skill/command reference. `PROJECTS_AND_SKILLS.md` is the same reference in more detail (Burmese/English mixed — Mike's copy-paste cheat sheet).
>
> This file (`CLAUDE.md`) covers repo **structure and workflow mechanics** — the "how do I move around and ship safely" layer that the other two don't.

---

## What This Repo Is

`mikeronny16/Claude` is a **monorepo of ~16 independent products**, each owned by Mike Ronny, a solo indie hacker in Myanmar building small AI-powered web apps and digital products. There is no shared build system, no shared package (no Turborepo/Nx/workspaces) — every top-level folder is a **standalone app with its own `package.json`, `node_modules`, and deploy target**. Treat each project folder as its own repo that happens to live under one `.git`.

Mike communicates in Burmese/Myanmar; always reply in **simple English**. He wants short answers, working code over explanations, and fast fixes without excessive questions (see `MIKE_CONTEXT.md` → "Mike's Preferences").

---

## Repository Structure

```
/home/user/Claude/
├── CLAUDE.md                  ← you are here (structure & workflow)
├── MIKE_CONTEXT.md            ← master context: prefs, design system, tech stack, skills/commands
├── PROJECTS_AND_SKILLS.md     ← detailed project + skill + command reference (mixed Burmese/English)
├── SPAWN_AI_PROJECT.md        ← full product vision doc for Spawn AI (source of truth for that project)
├── SPAWN_AI_IDEA.md           ← early brainstorm doc for Spawn AI (superseded by SPAWN_AI_PROJECT.md)
├── SINAR_CLOTHING_PLAN.md     ← planning doc for Sinar Clothing
├── DRAFTWIN_SALE_DETAILS.md   ← DraftWin pricing/sale notes
├── DAILY_LOG_2025-05-27.md,   ← dated working notes / session logs — historical, not living docs
│   MORNING_BRIEF_22MAY.md
├── .claude/
│   ├── skills/                ← 15 skills (frontend-design, security-audit, mobile-ux, ...)
│   ├── commands/               ← /deploy, /fix, /new-page, /new-project, /supabase, /seo, /review
│   └── settings.json           ← Stop hook: ~/.claude/stop-hook-git-check.sh
├── .github/workflows/
│   ├── split-repos.yml         ← mirrors specific folders to standalone GitHub repos on push to main
│   └── build-android.yml       ← builds spawn-ai-mobile APK on push to that folder
│
├── app/ lib/ components/ prisma/, package.json ("ronnix-ai"), vercel.json   ← ⚠️ see "Root-Level App" below
│
├── aura/                ← AI personal stylist (selfie → outfit)
├── clinicai/             ← ClinicAI Myanmar — clinic automation landing page
├── colddm/               ← 30 cold-outreach scripts (digital product)
├── draftwin/             ← AI proposal writer for freelancers — LIVE
├── klaro/                ← Document explainer (Burmese)
├── portfolio/            ← Mike Ronny's dev portfolio
├── readyprompts/         ← 120-prompt AI kit — digital product
├── readyuse/              ← n8n / Make.com automation templates
├── ronnix-ai/             ← ⚠️ SECOND copy of Ronnix AI, see below
├── sinar-clothing/        ← Vite/React client site — ⚠️ handed to client, do not touch (see below)
├── spawn-ai/              ← AI pet creature game (egg → hatch → raise)
├── spawn-ai-mobile/       ← Expo/React Native client for Spawn AI
├── tikcheck/              ← TikTok/IG creator AI toolkit
├── toynar/                ← Turn a selfie into a collectible toy
├── whispr/                ← Anonymous messaging (NGL/Sarahah-style) — LIVE
└── yangonbus/             ← Yangon bus route finder (YBS)
```

Each project folder is self-contained: `cd <folder> && npm install && npm run dev`. Most also carry their own `AGENTS.md` (auto-generated Next.js version-drift warning) and a `CLAUDE.md` that just imports it (`@AGENTS.md`) — those are **not** real documentation, just a Next.js codegen stub. The actual per-project knowledge lives in this file, `MIKE_CONTEXT.md`, `PROJECTS_AND_SKILLS.md`, and (for Spawn AI specifically) `spawn-ai/CLAUDE.md` + `SPAWN_AI_PROJECT.md`.

### ⚠️ Root-Level App (gotcha)

The repo root itself (`/app`, `/lib`, `/components`, `/prisma`, root `package.json`, root `vercel.json`) is **not just a container — it's a live Next.js app**: the original **Ronnix AI** (Myanmar seller AI tools: caption generator, reply helper, product descriptions). It deploys straight from the repo root via the root `vercel.json`. Root `package.json` name is `"ronnix-ai"` and it uses Groq + Gemini.

There is **also** a `/ronnix-ai` subfolder with a separate, newer `package.json` (uses `@anthropic-ai/sdk` + `openai`, `src/`-based layout) — this looks like an in-progress rewrite that hasn't replaced the root app yet. **Before touching "Ronnix AI," check with Mike which copy (root vs `/ronnix-ai`) he means** — don't assume.

The root `/prisma/schema.prisma` (SQLite, User/Account/Session models) is leftover from before this repo became a monorepo and is unrelated to the current root app or to `spawn-ai/prisma` (which has its own separate schema). Don't confuse the two.

### ⚠️ Sinar Clothing

`PROJECTS_AND_SKILLS.md` flags this as **"handed to the client — never touch."** Recent commit history shows fixes were made there anyway (Viber/Messenger deep links). If asked to work on it, confirm with Mike first — the "locked" flag takes precedence over what git history suggests.

---

## Tech Stack Defaults

New projects should default to (see `MIKE_CONTEXT.md` for full detail):

```
Framework:   Next.js 16 App Router (latest) — a few older projects (colddm, readyprompts, toynar)
             are still on Next 15; don't downgrade new work to match them.
Language:    TypeScript
Styling:     Tailwind CSS + CSS variables
Database:    Supabase (PostgreSQL)
Auth:        bcryptjs + localStorage (no NextAuth) — Spawn AI is the exception (uses NextAuth + Prisma)
AI:          Groq (free tier, llama-3.3-70b) for most projects; Anthropic Claude for Spawn AI,
             Klaro, Aura, ronnix-ai/; Gemini for the root Ronnix AI app
Deploy:      Vercel, auto-deploy from main
Package mgr: npm (not pnpm, despite some skill docs mentioning pnpm)
```

**Design system default = "Ocean dark"** (`#040d1a` bg, `#06b6d4` cyan accent, Plus Jakarta Sans font, glass cards, mobile-first `max-w-xl`). Spawn AI is the one deliberate exception (dark purple `#0A0714` + gold `#F59E0B`, claymorphism). Full palette and component patterns are in `MIKE_CONTEXT.md` → "Design System".

**Critical Next.js 16 rules** (breaks builds if missed):
- Async route params: `params: Promise<{ slug: string }>` → must `await`.
- Every API route needs `export const dynamic = "force-dynamic"`.
- No `onMouseEnter`/other DOM event handlers in Server Components — use CSS `:hover` or split into a Client Component.
- Keep `next.config.ts` minimal — e.g. `turbopack.root` has broken Vercel builds before.

---

## Development Workflow

### Working on an existing project
```bash
cd <project-folder>          # e.g. cd whispr
npm install
npm run dev                  # or build / start / lint
```
Never run installs/builds from the repo root expecting them to apply repo-wide — there is no workspace linking; each folder is isolated.

### Committing & pushing
- Branch: work happens on `main` for day-to-day features (Vercel auto-deploys from `main` per project). Session/task branches (like this one) follow whatever the task specifies.
- **Always** `git pull origin main --rebase` before pushing.
- Commit format: `feat(<project>): short description` / `fix(<project>): short description` / `chore(...)`. Scope the commit to the project folder you changed (e.g. `git add whispr/`) — don't sweep in unrelated folders.
- Never push a project with a broken `npm run build`.

### `/deploy` flow (see `.claude/commands/deploy.md`)
1. `cd` into the project folder.
2. `npm run build` — fix all errors first.
3. `git add <project>/`, commit, `git pull --rebase`, `git push origin main`.

### Auto-mirroring to standalone repos
`.github/workflows/split-repos.yml` watches pushes to `main` under `spawn-ai/`, `readyprompts/`, `portfolio/`, `colddm/`, `whispr/`, `draftwin/`, `toynar/`, `sinar-clothing/`, `tikcheck/` and **force-pushes** each folder's contents (minus `.env`, `node_modules`, `.next`) to its own `Mikeronny16/<project>` GitHub repo. If you're editing one of these folders, know that a push to `main` here republishes that standalone repo too — that's by design, not a side effect to "fix".

`build-android.yml` builds a debug APK from `spawn-ai-mobile/` on every push touching that folder.

### New project scaffolding
Use the `/new-project` command (`.claude/commands/new-project.md`) or the `new-project` skill — both set up Next.js + Tailwind + Supabase + the Ocean Dark theme the same way Mike expects.

---

## Key Conventions (repo-wide)

- **No automated payment processors — ever.** No Stripe, PayPal, or crypto checkout in any project. Most Myanmar-based processors don't work for Mike; every project uses a manual flow: an "Upgrade" button opens Gmail with a pre-filled email to `mikeronny18@gmail.com`, and Mike manually approves in that project's `/admin` panel.
- **Mobile-first, always.** Mike tests on an iPhone 12 (390px width). Check that width before calling UI work done — run the `mobile-ux` skill before shipping any UI.
- **Secrets never in client code.** `NEXT_PUBLIC_*` env vars are public by definition — never put API keys or admin passwords there.
- **Before a deploy**, run the `security-audit`, `performance`, `seo-optimizer`, and `mobile-ux` skills (see `/review` command for the manual checklist version).
- **Short, direct communication.** Don't over-explain finished work — a short table of what changed is enough (per `MIKE_CONTEXT.md`).

---

## Skills & Commands

Full descriptions in `PROJECTS_AND_SKILLS.md`. Quick index:

**Skills** (`.claude/skills/`): `frontend-design`, `web-artifacts-builder`, `animation`, `cinematic-scroll`, `car-showroom`, `copywriting`, `landing-page-cro`, `marketing`, `digital-products`, `database-schema`, `mobile-ux`, `performance`, `security-audit`, `seo-optimizer`, `webapp-testing`.

**Commands** (`.claude/commands/`): `/deploy`, `/fix`, `/new-page`, `/new-project`, `/supabase`, `/seo`, `/review`.

---

## Documentation Map

| Question | Read |
|---|---|
| Mike's preferences, default stack, design system, full project/skill list | `MIKE_CONTEXT.md` |
| Detailed per-project status + skill/command reference (Mike's cheat sheet) | `PROJECTS_AND_SKILLS.md` |
| Repo structure, workflow mechanics, gotchas (this file) | `CLAUDE.md` |
| Spawn AI product vision, tone, feature spec | `SPAWN_AI_PROJECT.md` |
| Spawn AI operational rules (do/don't, progress tracker, stack) | `spawn-ai/CLAUDE.md` |
| DraftWin pricing/sale history | `DRAFTWIN_SALE_DETAILS.md` |
| Sinar Clothing plan (folder is locked — read before proposing changes) | `SINAR_CLOTHING_PLAN.md` |
| Old dated session notes | `DAILY_LOG_2025-05-27.md`, `MORNING_BRIEF_22MAY.md` — historical only, don't treat as current state |

`MIKE_CONTEXT.md` and `PROJECTS_AND_SKILLS.md` carry their own "last updated" dates and can drift from the actual code — if something they say conflicts with what you find in a project's `package.json` or recent commits, trust the code and flag the mismatch to Mike rather than silently picking one.
