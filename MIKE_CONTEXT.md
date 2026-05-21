# Mike Ronny — Master Context File
# Read this first in every new session.

---

## WHO IS MIKE

- **Name**: Mike Ronny (mikeronny18@gmail.com)
- **Location**: Myanmar
- **Testing device**: iPhone 12 (390px width)
- **Languages**: Burmese primary, simple English UI
- **Payment processors**: Most don't work in Myanmar — use manual email payment only, NO Stripe/PayPal/Paddle
- **GitHub**: mikeronny16/Claude (monorepo — all projects inside)
- **Vercel**: All projects deployed on Vercel under mikeronny16's account

---

## MIKE'S PREFERENCES

**Likes:**
- Ocean dark theme (#040d1a, #06b6d4 cyan)
- Mobile-first design, clean minimal UI
- Features that go viral (share cards, leaderboards, streaks)
- Fast builds, no wasted time
- Short answers — don't over-explain
- When errors happen, fix immediately, don't ask too many questions

**Dislikes:**
- Complicated payment flows
- Too much explanation / long text responses
- Purple gradient on white (generic AI design)
- Inter/Roboto fonts (use Plus Jakarta Sans)
- Slow, step-by-step hand-holding

**Communication style:**
- Mike writes in Burmese/Myanmar — always respond in simple English
- Short, direct answers
- Show code, not theory
- When task is done, say what was built in a simple table

---

## TECH STACK (always use this)

```
Framework:   Next.js 16 App Router (latest)
Language:    TypeScript
Styling:     Tailwind CSS + custom CSS variables
Database:    Supabase (PostgreSQL)
Auth:        bcryptjs + localStorage (no NextAuth)
AI:          Groq API (free tier) — llama-3.3-70b model
Deploy:      Vercel (main branch auto-deploy)
Package:     npm (not pnpm)
```

**Critical Next.js 16 rules:**
- Async params: `params: Promise<{ slug: string }>` → must await
- All API routes need: `export const dynamic = "force-dynamic"`
- No `onMouseEnter` in Server Components — use CSS :hover
- `next.config.ts` must be simple (no turbopack.root — breaks Vercel)

---

## DESIGN SYSTEM

**Colors:**
```css
--bg: #040d1a
--accent: #06b6d4  (cyan)
--accent-dim: #0891b2
--blue: #3b82f6
--glass: rgba(6,182,212,0.05)
--glass-border: rgba(6,182,212,0.15)
--text: #f0f9ff
--text-dim: rgba(240,249,255,0.6)
--text-faint: rgba(240,249,255,0.3)
```

**Font:** Plus Jakarta Sans (Google Fonts)

**Components:**
- Glass cards: `background: var(--glass); border: 1px solid var(--glass-border); border-radius: 1.5rem`
- Glow buttons: `linear-gradient(135deg, #06b6d4, #0891b2)` + box-shadow glow
- Layout: `max-w-xl mx-auto px-4` (mobile-first)

**Animations:** float-slow, float-alt, slideUp, fadeIn, shimmer (skeleton), glowPulse, messagePop

---

## PROJECTS BUILT

### 1. DraftWin (claude-hsmg.vercel.app)
- **What**: AI proposal writer for freelancers
- **Stack**: Next.js 16, Groq (llama-3.3-70b), Supabase, manual email payment
- **Pricing**: $5 (30 credits), $15 (100 credits), $39 (300 credits)
- **Folder**: `/draftwin`
- **Status**: Live ✅
- **Admin**: `/admin?pwd=[ADMIN_PASSWORD]`
- **Features**: Proposal generate, rewrite, templates, history, share win card, snippet vault, pricing calculator, live counter, score ring, confetti

### 2. Whispr (whispr-shh.vercel.app)
- **What**: Anonymous message platform (NGL/Sarahah style)
- **Stack**: Next.js 16, Supabase, bcryptjs, no external auth
- **Folder**: `/whispr`
- **Status**: Live ✅
- **Supabase project**: ynrnnmwrjcbnibankseq.supabase.co
- **Admin**: `/admin` (protected by WHISPR_ADMIN_PASSWORD env var)
- **Features**:
  - Anonymous messaging with mood (💬❤️🔥🤔)
  - Question prompts (Roast me, Rate me, etc.)
  - Reactions (❤️😂😮💯🔥) + public replies
  - Share card (PNG download via html2canvas)
  - Leaderboard (/leaderboard)
  - Streak system 🔥 (whispr_streaks table)
  - Mood analytics + weekly challenge (50 msg goal)
  - View tracking (whispr_views table)
  - Admin insight panel (users/messages/views stats + charts)

**Supabase tables:**
```sql
whispr_users (id, username, display_name, avatar_emoji, password_hash, created_at)
whispr_messages (id, recipient_id, content, sender_mood, reaction, public_reply, is_read, created_at)
whispr_views (id, username, created_at)
whispr_streaks (id, user_id, last_login, streak_count, updated_at)
```

### 3. Spawn AI (spawn-ai on Vercel)
- **What**: AI pet creature game (buy eggs, hatch, raise)
- **Stack**: Next.js, Prisma, NextAuth, Anthropic Claude API
- **Folder**: `/spawn-ai`
- **Status**: Built, needs API key

### 4. Sinar Clothing
- **Folder**: `/sinar-clothing`
- **Stack**: Vite
- **Status**: Built

### 5. Toynar
- **Folder**: `/toynar`
- **Status**: Built

---

## SKILLS AVAILABLE

Location: `.claude/skills/`

| Skill | When to use |
|---|---|
| `frontend-design` | Any UI — avoid AI slop, bold design |
| `web-artifacts-builder` | React + shadcn/ui components |
| `webapp-testing` | Playwright browser testing |
| `seo-optimizer` | Before final deploy — meta/OG tags |
| `security-audit` | Check auth, keys, SQL injection |
| `database-schema` | New Supabase tables |
| `performance` | Speed optimization |
| `mobile-ux` | iPhone 12 checklist |
| `copywriting` | Viral copy, Gen Z audience |

---

## COMMANDS AVAILABLE

Location: `.claude/commands/`

| Command | What it does |
|---|---|
| `/deploy` | build → commit → push to main |
| `/fix` | Fix all build errors |
| `/new-page` | Ocean dark page template |
| `/new-project` | Full Next.js + Supabase setup |
| `/supabase` | Generate SQL + instructions for Mike |
| `/seo` | Add meta/OG tags to pages |
| `/review` | Code quality + security check |

---

## GIT WORKFLOW

- **Repo**: mikeronny16/Claude (monorepo)
- **Main branch**: main (Vercel auto-deploys from here)
- **Always**: `git pull origin main --rebase` before push
- **Commit format**: `feat(whispr): add leaderboard` / `fix: build error`
- **Push**: `git push origin main`
- **Never**: push broken build, force push to main

---

## PAYMENT (IMPORTANT)

- NO Stripe, NO PayPal, NO crypto in any project
- Upgrade button → opens Gmail with pre-filled email to mikeronny18@gmail.com
- Mike manually approves in `/admin` panel
- Myanmar payment processors don't work

---

## START OF SESSION CHECKLIST

When starting a new session with Mike:
1. Read this file ✅
2. Ask what project we're working on today
3. Check current build status if needed (`npm run build`)
4. Pick up where we left off

---

*Last updated: 2026-05-21 | All projects by Mike Ronny*
