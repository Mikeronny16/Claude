# DraftWin — Complete Website Details
### Ready-to-Sell SaaS | AI Freelance Proposal Generator

---

## 🌐 Live Website
- **URL**: https://claude-hsmg.vercel.app
- **Status**: Live & fully functional
- **Hosting**: Vercel (free tier, auto-deploy from GitHub)

---

## 💰 Business Model

### Revenue Streams
| Stream | How It Works |
|--------|-------------|
| Credit Packs | Users buy credits to generate proposals |
| Crypto (USDT BSC) | Fully automated via NOWPayments |
| Manual (Myanmar) | Admin manually approves via /admin panel |

### Pricing
| Package | Credits | Price |
|---------|---------|-------|
| Starter | 20 credits | $5 USD |
| Pro | 70 credits | $15 USD |
| Power | 200 credits | $39 USD |

- New users get **3 free credits** on signup (no email required)
- Referral system: referee gets **+2 bonus credits**

### Earning Potential
- 100 users × Pro pack = **$1,500/month**
- Affiliate program pays 30% commission to promoters
- SEO traffic from 10 pre-built template pages (free organic users)

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS variables |
| AI | Groq API (llama-3.3-70b-versatile) — **FREE tier** |
| Database | Supabase (PostgreSQL) |
| Payments | NOWPayments (USDT BSC — automatic) |
| Hosting | Vercel |
| PDF Export | jsPDF |
| Animations | CSS keyframes + canvas-confetti |
| Font | Plus Jakarta Sans |

### Why Groq (not OpenAI)?
- **100% free** AI generation (Groq free tier)
- Fast responses (< 3 seconds)
- No API cost = 100% profit margin on AI calls

---

## 🔑 Environment Variables Needed

```env
# Groq AI (free)
GROQ_API_KEY=your_groq_key

# Supabase (database)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NOWPayments (crypto payments)
NOWPAYMENTS_API_KEY=your_nowpayments_key
NOWPAYMENTS_IPN_SECRET=your_ipn_secret

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Admin panel
ADMIN_PASSWORD=your_admin_password
```

---

## 📁 File Structure

```
draftwin/
├── app/
│   ├── page.tsx              ← Main homepage (hero, form, results)
│   ├── layout.tsx            ← SEO meta tags, font loading
│   ├── globals.css           ← All CSS variables, animations
│   ├── admin/page.tsx        ← Password-protected admin panel
│   ├── affiliate/page.tsx    ← Affiliate program page (30% commission)
│   ├── templates/
│   │   ├── page.tsx          ← SEO template index (10 niches)
│   │   └── [slug]/page.tsx   ← 10 individual SEO pages
│   └── api/
│       ├── generate/         ← Main AI proposal generation
│       ├── followup/         ← Follow-up message generator
│       ├── rewrite/          ← Proposal rewriter
│       ├── credits/          ← Get user credits
│       ├── referral/         ← Referral bonus system
│       ├── admin/credits/    ← Admin credit assignment
│       └── payment/
│           ├── create/       ← Create NOWPayments invoice
│           └── webhook/      ← Auto-credit on payment
├── components/
│   ├── ProposalForm.tsx      ← Main form (skills, tone, platform, length)
│   ├── ProposalResult.tsx    ← Result card (copy, PDF, email, follow-up)
│   ├── PricingModal.tsx      ← Buy credits modal
│   ├── HistoryModal.tsx      ← Saved proposals history
│   ├── DashboardModal.tsx    ← Usage stats dashboard
│   ├── TemplatesModal.tsx    ← 10 niche templates picker
│   ├── SnippetVaultModal.tsx ← Save/reuse text snippets
│   ├── PricingCalcModal.tsx  ← Freelance rate calculator
│   ├── RewriterModal.tsx     ← AI proposal rewriter
│   ├── ShareWinModal.tsx     ← LinkedIn/Twitter share on win
│   ├── LiveCounter.tsx       ← Animated number counter
│   └── LangSelector.tsx      ← 8-language selector
└── lib/
    ├── groq.ts               ← All AI generation functions
    ├── supabase.ts           ← Database (credits, users)
    ├── history.ts            ← localStorage proposal history
    ├── i18n.ts               ← 8 languages translation
    └── auth.ts               ← Admin auth helper
```

---

## ✨ Features List (Full)

### Core
- ✅ AI proposal generator (30 seconds, free)
- ✅ Cover letter mode
- ✅ 5 tones: Professional, Friendly, Creative, Confident, Urgent
- ✅ 4 platforms: Upwork, Fiverr, Email, LinkedIn
- ✅ 3 lengths: Short (~150w), Medium (~300w), Long (~500w)
- ✅ Proposal quality score (1–10) with animated ring
- ✅ Edit proposal inline after generation

### Tools
- ✅ PDF export with DraftWin branding
- ✅ Send via email (mailto)
- ✅ Follow-up message generator (1 credit)
- ✅ Proposal rewriter with tips (1 credit)
- ✅ Snippet vault (save reusable text)
- ✅ Rate calculator (12 project types)
- ✅ 10 niche template library

### User Experience
- ✅ No signup required (localStorage UUID)
- ✅ Dark / light mode
- ✅ 8 languages (EN, ES, FR, DE, PT, AR, ZH, HI)
- ✅ Proposal history with win/loss tracking
- ✅ Win rate dashboard
- ✅ Referral system (+2 credits per referral)
- ✅ Share on LinkedIn/Twitter when proposal wins

### Design & Animations
- ✅ Confetti burst on proposal generation
- ✅ Typewriter hero headline on page load
- ✅ 3 floating animated gradient orbs in hero
- ✅ Skeleton loader with shimmer (no spinner)
- ✅ Animated SVG score ring
- ✅ Modal slide-up (mobile) / fade-scale (desktop)
- ✅ Card hover lift + glow on all feature cards
- ✅ Pulsing glow on generate button
- ✅ Credits pop animation on update
- ✅ Live counter animation in hero stats

### SEO & Growth
- ✅ Full OpenGraph + Twitter card meta tags
- ✅ OG image (/og-image.svg)
- ✅ 10 pre-rendered SEO template pages
- ✅ /affiliate page (30% commission program)
- ✅ Footer links for organic discovery

### Admin & Payments
- ✅ Password-protected /admin panel
- ✅ Manual credit assignment (any amount)
- ✅ NOWPayments USDT BSC (fully automatic webhook)
- ✅ Payment flow: Create invoice → User pays → Webhook → Credits added

---

## 🗄️ Supabase Database Schema

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,        -- UUID from localStorage
  credits INTEGER DEFAULT 3,  -- starts with 3 free credits
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Simple — just one table. Credits are stored server-side.

---

## 🔐 Admin Panel (/admin)

- URL: `https://your-domain.com/admin`
- Password: set via `ADMIN_PASSWORD` env var (server-side only, never exposed)
- Functions:
  - Add credits to any user ID
  - Quick packages: Starter (20), Pro (70), Unlimited (200)
  - Custom amount input
  - Reference table showing MMK/USD prices

---

## 💳 Payment Flow

### Automatic (USDT BSC via NOWPayments)
1. User clicks buy → `/api/payment/create` → NOWPayments invoice created
2. User pays USDT on BSC network
3. NOWPayments sends webhook to `/api/payment/webhook`
4. IPN secret verified → Credits added to user automatically
5. User sees updated credit count instantly

### Manual (Myanmar / other methods)
1. User sends payment proof to Mike's email/phone
2. Admin opens `/admin`, enters user's ID and package
3. Click "Add Credits" → credits added immediately

---

## 🌍 Languages Supported
English, Spanish, French, German, Portuguese, Arabic (RTL), Chinese, Hindi

---

## 📈 SEO Pages (Free Google Traffic)

Pre-rendered at build time — Google-indexable:
- `/templates` — Index page
- `/templates/web-developer`
- `/templates/graphic-designer`
- `/templates/content-writer`
- `/templates/mobile-app-developer`
- `/templates/seo-specialist`
- `/templates/video-editor`
- `/templates/virtual-assistant`
- `/templates/ui-ux-designer`
- `/templates/data-analyst`
- `/templates/copywriter`

---

## 🚀 How to Deploy (New Owner)

1. Fork/clone the repo from GitHub
2. Create Vercel account → Import project
3. Set all environment variables in Vercel dashboard
4. Set up Supabase: create `users` table (schema above)
5. Get Groq API key (free at console.groq.com)
6. Get NOWPayments account + set webhook URL to `https://your-domain.com/api/payment/webhook`
7. Deploy — done

Total setup time: **~30 minutes**

---

## 💡 Growth Opportunities (For New Owner)

- [ ] Custom domain (e.g. draftwin.com)
- [ ] Google Ads targeting "upwork proposal template"
- [ ] ProductHunt launch
- [ ] YouTube tutorial → free traffic
- [ ] Expand to 20+ template pages (more SEO)
- [ ] Add Stripe for card payments
- [ ] Add proposal analytics (views, reply rate)
- [ ] Mobile app (React Native reuse)

---

## 📊 Valuation Basis

| Metric | Value |
|--------|-------|
| Live URL | ✅ Yes |
| Monthly AI cost | $0 (Groq free) |
| Monthly hosting | $0 (Vercel free) |
| Features | 30+ |
| SEO pages | 11 |
| Languages | 8 |
| Payment system | Automated (USDT) + Manual |
| Code quality | Production-grade TypeScript |
| Setup time for buyer | ~30 minutes |

---

*Built by Mike Ronny — mikeronny18@gmail.com*
*Last updated: May 2026*
