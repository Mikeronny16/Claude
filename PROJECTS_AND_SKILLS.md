# Mike Ronny — Projects & Skills Master Reference

> New session မှာ ဒီ file ကို Claude ကို ပြပါ — အကုန်လုံး တစ်ခါတည်း သိသွားမယ်။
> Last updated: 2026-06-05

---

# 📦 PART 1 — PROJECTS (အကုန်လုံး)

မုနlocation: `mikeronny16/Claude` monorepo · Deploy: Vercel (main branch auto-deploy)

| # | Project | Folder | ဘာလဲ | Status |
|---|---------|--------|------|--------|
| 1 | **DraftWin** | `/draftwin` | Freelancer အတွက် AI proposal writer | Live ✅ |
| 2 | **Whispr** | `/whispr` | Anonymous message platform (NGL style) | Live ✅ |
| 3 | **Spawn AI** | `/spawn-ai` | AI pet creature game (egg → hatch → raise) | Redesign ✅ |
| 4 | **Spawn AI Mobile** | `/spawn-ai-mobile` | Spawn AI ရဲ့ React Native (Expo) app | Built |
| 5 | **Ronnix AI** | `/ronnix-ai` | Myanmar online sellers — 11 AI tools platform | Built |
| 6 | **AURA** | `/aura` | AI personal stylist (selfie → outfit) | Built |
| 7 | **Toynar** | `/toynar` | AI — ကိုယ့်ပုံကို collectible toy ဖြစ်အောင် | Built |
| 8 | **Klaro** | `/klaro` | Document explainer ( စာရွက်ကို ရှင်းပြ) | Built |
| 9 | **TikCheck** | `/tikcheck` | TikTok/IG creator AI toolkit (viral score) | Built |
| 10 | **ReadyPrompts** | `/readyprompts` | 120 AI prompt kit — $7 digital product | Built |
| 11 | **ColdDM** | `/colddm` | 30 cold outreach scripts (freelancer) | Built |
| 12 | **Readyuse** | `/readyuse` | n8n & Make.com automation templates | Built |
| 13 | **ClinicAI Myanmar** | `/clinicai` | Clinic automation platform (Burmese) | Built |
| 14 | **YBS Guide** | `/yangonbus` | Yangon bus finder (YBS routes) | Built |
| 15 | **Portfolio** | `/portfolio` | Mike Ronny developer portfolio | Built |
| 16 | **Sinar Clothing** | `/sinar-clothing` | ⚠️ Client ဆီ ပေးပြီး — **မထိရ** | Locked 🔒 |

### Project Details (အရေးကြီးတာတွေ)

**DraftWin** (claude-hsmg.vercel.app)
- Stack: Next.js 16, Groq (llama-3.3-70b), Supabase, manual email payment
- Pricing: $5 (30 credits) / $15 (100) / $39 (300)
- Admin: `/admin?pwd=[ADMIN_PASSWORD]`
- Features: proposal generate/rewrite, templates, history, share win card, snippet vault, score ring, confetti

**Whispr** (whispr-shh.vercel.app)
- Stack: Next.js 16, Supabase (ynrnnmwrjcbnibankseq), bcryptjs (no NextAuth)
- Features: anonymous msg + mood, question prompts, reactions, public reply, share card PNG, leaderboard, streak 🔥, weekly challenge, admin insights
- Tables: `whispr_users`, `whispr_messages`, `whispr_views`, `whispr_streaks`

**Spawn AI** (spawn-ai on Vercel)
- Stack: Next.js 16 + Turbopack, Prisma 7 + Supabase (okedzhrtnrofefliwzbq), NextAuth, Anthropic Claude API
- Design: dark purple #0A0714 + gold #F59E0B, claymorphism, Genshin-style 5-star hatching, surrounding arc stats
- Payment: manual email (no Stripe) → admin approves in `/admin`
- Models: free=claude-haiku-4-5, paid=claude-sonnet-4-5
- ⚠️ Vercel env vars လို: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`

**Ronnix AI**
- "Myanmar Online Sellers AI Platform — 11 AI Tools"
- Stack: Next.js, claude-haiku-4-5-20251001 (model ID fixed)

---

# 🧠 PART 2 — SKILLS (အကုန် ၁၅ ခု)

Location: `.claude/skills/`

## 🎬 Build / Design Skills

### `cinematic-scroll`
Apple.com-style scroll-driven product reveal.
- Image sequence (frame-0001.webp → frame-0280.webp) → canvas → scroll နဲ့ play
- GSAP ScrollTrigger scrub (scroll position = frame index)
- Pinned text reveals, mobile static poster fallback
- Frames: Veo / fal.ai / ffmpeg နဲ့ generate
- **သုံးချိန်**: car 360°, product zoom, Apple-style hero

### `car-showroom`
Luxury car showroom full site (`cinematic-scroll` depend).
- Cinematic hero + spec counter + color configurator + model lineup + test-drive form
- Stack: Next.js 15 + TS + Tailwind + GSAP + Framer Motion + Supabase
- Myanmar: KBZPay/Wave/MMQR, Burmese font, bilingual
- **သုံးချိန်**: car dealership, EV launch, vehicle showroom

### `frontend-design`
Production-grade UI — distinctive, generic AI slop မဟုတ်ဘဲ။
- Web components, pages, dashboards, landing pages
- **သုံးချိန်**: UI/component/page တိုင်း

### `web-artifacts-builder`
Complex HTML/React artifacts (React + Tailwind + shadcn/ui).
- **သုံးချိန်**: prototype, dashboard, interactive demo

### `animation`
Pure CSS + vanilla JS animations (Framer Motion မသုံးဘဲ).
- Tailwind keyframes, scroll-trigger
- **သုံးချိန်**: micro-interactions, motion

## ✍️ Content / Growth Skills

### `copywriting`
Viral conversion copy — SE Asia Gen Z audience ($2-$10 products).
- **သုံးချိန်**: landing copy, CTA, marketing text

### `landing-page-cro`
Conversion Rate Optimization — doubt ဖျောက်, value ပြ, momentum.
- **သုံးချိန်**: sales/landing page

### `marketing`
Marketing & growth (SE Asia + global creators).
- **သုံးချိန်**: growth strategy, launch plan

### `digital-products`
Digital download products ($2-$10, crypto NOWPayments, instant delivery).
- **သုံးချိန်**: product packaging, delivery flow

## 🔧 Quality / Pre-Deploy Skills

### `database-schema`
Supabase PostgreSQL schema (types, foreign keys, RLS, indexes).
- **သုံးချိန်**: project/table အသစ်တိုင်း

### `mobile-ux`
iPhone 12 (390px) UX checklist — touch targets, spacing, font, scroll.
- **သုံးချိန်**: project တိုင်း မလုပ်ခင်

### `performance`
Next.js speed optimization — images, fonts, bundle, Core Web Vitals.
- **သုံးချိန်**: deploy မလုပ်ခင်

### `security-audit`
Next.js + Supabase security — auth, SQL injection, XSS, exposed keys.
- **သုံးချိန်**: deploy မလုပ်ခင်

### `seo-optimizer`
Complete SEO — meta, Open Graph, Twitter cards, structured data, sitemap.
- **သုံးချိန်**: public page တိုင်း

### `webapp-testing`
Playwright local web app testing — screenshots, UI debug, browser logs.
- **သုံးချိန်**: feature verify

---

# ⚡ PART 3 — COMMANDS

Location: `.claude/commands/`

| Command | ဘာလုပ် |
|---------|--------|
| `/deploy` | build → commit → push to main |
| `/fix` | build error အကုန် ဖြေ |
| `/new-page` | Ocean dark page template |
| `/new-project` | Next.js + Supabase full setup |
| `/supabase` | SQL + instructions generate |
| `/seo` | meta/OG tags ထည့် |
| `/review` | code quality + security check |

---

# 🎨 PART 4 — DEFAULTS (Mike ရဲ့ standard)

**Stack**: Next.js 16 App Router · TypeScript · Tailwind · Supabase · Groq (free) / Anthropic · Vercel · npm

**Design (Ocean dark — default)**:
```css
--bg: #040d1a · --accent: #06b6d4 (cyan) · --blue: #3b82f6
--text: #f0f9ff · Font: Plus Jakarta Sans
Glass cards · glow buttons · max-w-xl mobile-first
```
> Spawn AI က ထူးခြား — dark purple + gold သုံး။

**Rules**:
- Payment: manual email ONLY (no Stripe/PayPal/crypto checkout) — Myanmar
- Mobile-first, iPhone 12 (390px) test
- Burmese primary, simple English UI
- Short answers, fix errors fast
- ⚠️ `/sinar-clothing` — client ဆီ ပေးပြီး၊ **ဘယ်တော့မှ မထိရ**

---

# 🚀 New Session မှာ သုံးပုံ (Copy-paste)

```
# Session စတဲ့အခါ:
Read MIKE_CONTEXT.md and PROJECTS_AND_SKILLS.md first.

# Project အသစ်:
Use the new-project command. Name: [X], idea: [Y]

# Car showroom:
Use the car-showroom skill. Brand: [NAME], accent: [HEX], car: [MODEL]

# Deploy မလုပ်ခင်:
Run security-audit, performance, seo-optimizer, mobile-ux skills.

# Existing project ဆက်လုပ်:
Continue [project name] in /[folder]. [ဘာလုပ်မလဲ]
```
