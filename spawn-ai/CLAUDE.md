@AGENTS.md

# Spawn AI — Project Rules

> Full vision doc: `../SPAWN_AI_PROJECT.md` — read it before any feature/design/architecture decision.
> Root monorepo conventions: `../CLAUDE.md` and `../MIKE_CONTEXT.md`.

## What This Is

A web app where users buy AI eggs, hatch them, and raise unique AI pet creatures. The vibe is "raising a digital creature from baby to adult", NOT "chatting with an AI assistant".

**The deeper question this product asks:**
> *In a world that scrolls past everything — how much care do we still have left?*

Spawn AI is positioned as a quiet experiment in caring, not just a pet app. Keep this philosophy in mind for all copy, design, and feature decisions.

## Core Principles (DO NOT VIOLATE)

### 1. The Pet Must Feel ALIVE
- Pets are NOT assistants. They have moods, needs, personalities.
- Never let the AI break character with "as an AI..." or "I'm just a program".
- Speech style MUST match lifecycle stage (baby babbles, adult speaks fully).
- Pets react to their hunger, energy, happiness in conversation.

### 2. Cost-Aware Always
- Free tier uses `claude-haiku-4-5` model (cheap).
- Paid tiers use `claude-sonnet-4-5` (better).
- Enforce daily message limits server-side.
- Energy system gates messages (cost control disguised as gameplay).

### 3. Manual Payment Flow Only (v1)
- NO Stripe, NO crypto, NO Paddle in v1.
- Upgrade button → opens Gmail with pre-filled email to admin.
- Admin manually approves in `/admin` panel.
- Owner is in Myanmar; most payment processors don't work there.

### 4. Mobile-First
- Owner uses iPhone 12 for testing.
- Every page must look great on mobile screens.
- Test responsiveness at 390px width.

### 5. Personality is Permanent
- Generated ONCE at hatching from "personality seeds" (whispers to the egg).
- Stored in `pet.personality` JSON field.
- Stays stable. Only drifts slowly over weeks.
- Every chat message includes personality in the system prompt.

## Things to NEVER Do

- Don't add Stripe or any automated payment processor.
- Don't make pets sound like ChatGPT/Claude assistants.
- Don't skip the egg incubation phase — it's core to the experience.
- Don't let pets discuss things outside their developmental stage.
- Don't use harsh "corporate SaaS" design — keep it warm/whimsical.
- Don't send full conversation history to API every time — summarize.

## Things to ALWAYS Do

- Read `../SPAWN_AI_PROJECT.md` for any feature decision.
- Reference `pet.personality` and `pet.stage` in every chat system prompt.
- Use the soft purple `#8B5CF6` + amber `#F59E0B` palette (dark purple `#0A0714` base — Spawn AI is the one project that does NOT use the Ocean Dark default, see root `MIKE_CONTEXT.md`).
- Add `framer-motion` animations to egg/hatching/level-up events.
- Commit after each meaningful feature (the owner reviews on phone).
- Update the progress tracker below as features ship.

## Stack

Next.js + Turbopack, Prisma + Supabase (Postgres), NextAuth, Anthropic Claude API.
Vercel env vars required: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`.

## Progress Tracker

> Update this section as you build. Owner reads it to track progress.

### Phase 1 — Core Loop
- [x] Next.js + Tailwind + Prisma setup
- [x] Database schema and migrations
- [x] Email/password auth with NextAuth
- [x] Landing page (mobile-first)
- [x] About page with founder story (Mike Ronny)
- [x] User signup gives 1 free common egg
- [x] Incubator page with whisper system
- [x] Hatching flow + personality generation from seeds
- [x] Pet page with chat (mock responses by stage)
- [x] Mock AI integration with stage-aware prompts (baby/child/teen/adult)
- [x] Feed/play/sleep/pet actions with stat effects
- [x] XP + leveling system with stage transitions

### Phase 2 — Polish
- [x] Egg shop UI (tier display, locked tiers for free users)
- [x] Pricing page with upgrade flow (manual email payment)
- [x] Admin panel for manual payment approvals
- [x] Stats decay over time (cron/background job — `/api/cron/decay`, daily at midnight)
- [ ] Real Anthropic Claude API integration (add API key when ready)
- [x] Framer Motion animations for hatching event + level-up banner + action button floats

### Phase 3 — Depth
- [ ] Rare/Epic/Mythic eggs
- [ ] Browser push notifications
- [ ] Social features

## Development Notes

- Use `pnpm` if available, otherwise `npm`.
- For new shadcn components: `npx shadcn@latest add [component]`.
- Test the chat with at least 3 different personality combinations before shipping.
- Commit message format: `feat(spawn-ai): add hatching animation` / `fix(spawn-ai): pet stats not updating`.

## Communicating with Owner

The owner speaks Burmese/Myanmar primarily. When writing user-facing copy:
- Default to **English UI** but keep language simple.
- Don't auto-translate to Burmese unless owner asks.
- Comments in code: English.
- When asking owner questions: be specific, give them 2-3 options to pick from.

There's also `spawn-ai-mobile/` — a React Native (Expo) client for this same backend/vision.
