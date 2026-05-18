# MyanmarAI Writer

AI-powered Burmese content generation platform for social media managers, online sellers, and digital marketers in Myanmar.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **Database**: SQLite (Prisma ORM) — easy to migrate to Postgres
- **Auth**: NextAuth.js v5 (Google OAuth + email/password)
- **AI**: Anthropic Claude API (`claude-sonnet-4-5`)
- **Deploy**: Vercel-ready

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your keys
cp .env.example .env.local

# 3. Run database migration
npm run db:migrate

# 4. Seed sample templates (optional)
npm run db:seed

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
ANTHROPIC_API_KEY="your-anthropic-api-key"
ADMIN_EMAIL="your-admin-gmail@gmail.com"
```

## Features

- **7 AI Tools**: Facebook Post, Product Description, Marketing Caption, Email Reply, Hashtag Generator, Blog Outline, EN↔MY Translator
- **Auth**: Google OAuth + email/password signup
- **Plans**: Free (10 credits), Pro ($9/mo, 500 credits), Business ($29/mo, unlimited)
- **Manual Payment Flow**: Admin approval via Gmail — no payment gateway needed
- **Admin Panel**: `/admin` — approve payments, manage users
- **Mobile Responsive**: Hamburger menu, responsive layouts

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/auth/signin` | Sign in |
| `/auth/signup` | Sign up |
| `/dashboard` | User dashboard |
| `/dashboard/tools` | All AI tools |
| `/dashboard/tools/[toolId]` | Individual tool |
| `/dashboard/history` | Generation history |
| `/dashboard/billing` | Plans & billing |
| `/dashboard/settings` | Profile settings |
| `/admin` | Admin panel (admin email only) |

## Upgrade Flow

Users click "Upgrade" → Gmail opens with pre-filled email → Admin receives request → Admin approves in `/admin` → Plan activates for 30 days.

## Deploy to Vercel

```bash
vercel deploy
```

Set all environment variables in Vercel dashboard. For production, migrate `DATABASE_URL` to a hosted Postgres (e.g., Vercel Postgres, Supabase).
