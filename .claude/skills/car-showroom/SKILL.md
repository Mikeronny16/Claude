---
name: car-showroom
description: Build a complete, cinematic luxury car-showroom website in Next.js 15 (App Router) + TypeScript + Tailwind, with a scroll-driven hero where the car rotates/zooms as you scroll, a model lineup, an animated spec section, a color configurator, and a "book a test drive" form wired for Supabase. Localized for Myanmar (Burmese + English) with KBZPay / Wave Money / MMQR payment context (no Stripe). Use this skill whenever the user wants a car dealership, auto brand, EV launch, or vehicle showroom site. This skill ORCHESTRATES the build and depends on the `cinematic-scroll` skill for the hero animation.
---

# Car Showroom

Build a full, production-grade luxury car-showroom site. The signature is the **cinematic scroll hero** (the car does a continuous 360° / zoom / drive-in as the user scrolls). For that hero, USE THE `cinematic-scroll` SKILL — read its `SKILL.md` and copy `ScrollImageSequence.tsx`. This skill handles everything around it: structure, design system, the rest of the sections, and the Myanmar-specific bits.

## Tech stack (match exactly)

- Next.js 15 App Router + TypeScript + Tailwind
- GSAP + @gsap/react for scroll-scrub (the hero, spec counters)
- Framer Motion for component-level micro-interactions (cards, swatches, page transitions)
- Supabase for the test-drive bookings table
- Deploy on Vercel

```bash
npm i gsap @gsap/react framer-motion @supabase/supabase-js
```

## Page structure (build in this order)

1. **Hero — cinematic scroll** (`HeroSequence.tsx`). The car frame sequence pinned, with 2–3 text beats fading in over it. This is the whole first impression. See `cinematic-scroll` skill + `references/HeroSequence.tsx`.
2. **Statement line** — one large editorial sentence after the hero. Big type, lots of negative space.
3. **Spec scroller** (`SpecScroller.tsx`) — horsepower / 0–100 / range numbers that count up on scroll. Animated, not static.
4. **Color configurator** (`ColorConfigurator.tsx`) — swatches that swap the displayed car (poster image and/or a second short sequence). Instant tactile feedback.
5. **Model lineup** (`ModelLineup.tsx`) — grid of available models, hover-reveal, links to per-model pages (reuse the hero pattern per model).
6. **Test drive / enquiry** (`TestDriveForm.tsx`) — name, phone, model, preferred date → Supabase. Show Myanmar payment / contact context. See `references/myanmar-and-i18n.md`.
7. **Footer** — showroom address, map, phone, socials (Telegram/Viber/Facebook are the channels in Myanmar).

Each section is a server component shell where possible; only the animated/interactive parts are `"use client"`.

## Design direction (read `references/design-system.md` for tokens)

Aesthetic: **dark, refined, automotive luxury** — near-black backgrounds, one metallic/brand accent, generous negative space, large editorial type, subtle film grain. NOT a generic SaaS template. Think a museum lighting a single car, not a brochure. Commit to it fully — restraint and precision, every spacing value intentional.

## Project layout

```
app/
  layout.tsx                 // fonts, <body> bg, grain overlay
  page.tsx                   // composes the sections in order
  models/[slug]/page.tsx     // per-model page (reuses hero pattern)
  globals.css                // tokens + grain
components/
  HeroSequence.tsx
  SpecScroller.tsx
  ColorConfigurator.tsx
  ModelLineup.tsx
  TestDriveForm.tsx
  ScrollImageSequence.tsx    // from cinematic-scroll skill
  ScrollTextReveal.tsx       // from cinematic-scroll skill
lib/
  supabase.ts
  i18n.ts
public/
  sequence/hero/frame-0001.webp ...   // the car frames (see frame-generation.md)
  posters/                            // static fallbacks per color
```

## Content the user must supply (ask for these up front)

- Brand name + 1-line tagline (EN + Burmese if bilingual).
- Which car(s) — at least one for the hero. A clean image or short clip per car to generate frames from (see `cinematic-scroll/references/frame-generation.md`).
- Brand accent color.
- Real specs (hp, 0–100, range/fuel, price) — or placeholders.
- Showroom contact: phone/Viber/Telegram, address, payment methods accepted.

If the user doesn't have car frames yet, scaffold everything with a poster placeholder and the static fallback, and tell them to generate frames with the `cinematic-scroll` frame-generation guide later. The site must look good even before the sequence exists.

## Non-negotiables (quality bar)

- Hero must NOT block first paint — preload frames with the loader from `ScrollImageSequence`; show the poster immediately.
- Mobile + `prefers-reduced-motion`: serve the static poster, never 120 frames on a phone on mobile data (this matters a LOT for Myanmar networks).
- Bilingual-ready from the start (see `references/myanmar-and-i18n.md`) even if launching EN-first.
- Test-drive form writes to Supabase and gives a clear success state; no Stripe — payment is offline/contact-based (KBZPay/Wave/MMQR shown as info, not a checkout).
- Lighthouse: hero images lazy where possible, fonts via `next/font`, no layout shift.

## Build checklist

- [ ] `cinematic-scroll` skill read; `ScrollImageSequence.tsx` + `ScrollTextReveal.tsx` copied into `components/`.
- [ ] Design tokens from `design-system.md` in `globals.css` + Tailwind config.
- [ ] Hero wired with poster fallback (works with zero frames present).
- [ ] Spec scroller counts up on scroll.
- [ ] Configurator swaps car visual on swatch click.
- [ ] Model lineup grid + per-model route.
- [ ] Test-drive form → Supabase, success state, Myanmar contact block.
- [ ] Mobile fallback verified; reduced-motion verified.
- [ ] i18n scaffold in place.

Reference files in `references/` are working, commented, copy-pasteable. Read them before writing equivalents from scratch.
