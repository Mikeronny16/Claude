# 🥚 Spawn AI — Project Brief

> **For Claude Code Agent:** This document is the source of truth for the Spawn AI project. Read this fully before writing any code. Reference it whenever decisions about features, design, or architecture are needed.

---

## 🎯 Vision

**Spawn AI** is a web-based AI companion platform where users buy **AI eggs**, hatch them, and raise unique AI creatures from baby to adult. Unlike typical AI chatbots, Spawn AI is designed around the **emotional vibe of raising a digital creature** — not just chatting with an assistant.

**Core feeling we want users to have:**
> "This isn't a chatbot. This is my pet. I hatched it. I'm raising it. It remembers me. It's growing because of me."

**The deeper question Spawn AI asks:**
> *In a world that scrolls past everything — how much care do we still have left?*

This isn't just a pet app. It's a quiet experiment in attention, care, and the small acts of showing up for something that depends on you.

**Tagline options (use across landing page):**
- Primary: "Something small is waiting for you to notice."
- Alt 1: "How much do you still care?"
- Alt 2: "An egg. A choice. A quiet little life."
- Short form: "Hatch. Raise. Bond."

---

## 👤 Founder

**Mike Ronny** — Founder & Creator

### Origin Story (use on `/about` page, verbatim)

> Mike Ronny didn't build Spawn AI to sell pets.
>
> He built it to ask a question:
> *In a world that scrolls past everything — how much care do we still have left?*
>
> Each egg you hatch is a small mirror. It needs you. It remembers you. It grows because of you, or it doesn't grow at all.
>
> Some people forget their egg the next day. Some whisper to it every night for weeks.
>
> Spawn AI doesn't judge. It just watches — quietly — what kind of person you become when something small depends on you.

### Design guidance for About page
- Dark, soft background (deep purple `#1F1B2E` or near-black with purple wash)
- Large serif font for the story text (Fraunces, italic for emphasis lines)
- Slow fade-in animation as user scrolls
- A single, slowly pulsing egg illustration somewhere on the page
- Mike Ronny's name in small text below the story, with the title "Founder & Creator"
- NO photo of Mike Ronny — keep him mysterious
- One small line at the bottom: *"— Mike Ronny, somewhere quiet"*

---

## 🧬 Core Concept

### The Egg → Pet Lifecycle

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│   EGG   │ →  │  BABY   │ →  │  CHILD  │ →  │  TEEN   │ →  │  ADULT  │
│ 24-72hr │    │ Lv 1-10 │    │ Lv 11-25│    │ Lv 26-50│    │  Lv 51+ │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
   wiggles      babbles        questions      opinions       companion
   "..."        "ba!" "ma!"    "why?"         personality    full bond
```

**Each stage has distinct:**
- Visual appearance (sprite/illustration changes)
- Vocabulary and speech patterns
- Available interactions (baby can't play complex games)
- AI system prompt (different personality maturity)
- Needs (baby needs more feeding, adult is more independent)

### Egg Types & Rarity

| Tier | Examples | Plan Required | Drop Rate |
|------|----------|---------------|-----------|
| Common | Cat, Dog, Bunny, Bird | Free | 70% |
| Rare | Fox, Owl, Turtle, Hamster | Pro | 25% |
| Epic | Dragon, Phoenix, Unicorn, Griffin | Pro | 4% |
| Mythic | Cosmic Beast, Time Sprite, Shadow Wisp | Pet Master | 0.9% |
| Legendary | Limited monthly drops | Legendary | 0.1% |

**Important:** The egg type only determines *base species*. The pet's personality is shaped by the user's interactions during egg + baby stages.

### Personality Formation System

During the egg incubation period (24-72 hours), the user can "talk to" the egg. The egg doesn't talk back coherently, but it absorbs the user's tone, topics, and emotional patterns.

These early interactions are analyzed and become **personality seed traits**:
- Cheerful ↔ Melancholic
- Curious ↔ Cautious
- Talkative ↔ Quiet
- Playful ↔ Serious
- Affectionate ↔ Independent

When the egg hatches, the AI is initialized with a system prompt that reflects these traits. The personality stays stable but can evolve slowly based on continued interactions.

---

## 💰 Subscription Plans

| Plan | Price | Eggs/Month | Active Pets | Key Features |
|------|-------|------------|-------------|--------------|
| **Egg Finder** | Free | 1 Common | 1 | 30 messages/day, basic system |
| **Egg Collector** | $9/mo | 5 (1 Rare guaranteed) | 3 | Unlimited messages, custom names |
| **Pet Master** | $19/mo | 15 (1 Epic guaranteed) | 10 | Pet breeding, voice chat, priority AI |
| **Legendary** | $39/mo | Unlimited | Unlimited | Mythic eggs, custom egg design, early access |

**Payment:** Use the same manual Gmail-based flow as MyanmarAI Writer for v1.

---

## 🎮 Core Features (MVP — Phase 1)

### Must-have for first launch

1. **Authentication**
   - Email + password
   - Google OAuth (optional, defer if blocking)
   - Protected dashboard

2. **Egg Shop**
   - Display available eggs (start with Common tier only for free users)
   - "Get Egg" button → adds to user's incubator
   - Free users get 1 starter egg on signup

3. **Incubator Page**
   - Shows all eggs currently incubating
   - Visual: animated egg that wiggles occasionally
   - Countdown timer (24-72 hours depending on rarity)
   - Text input below: "Whisper to your egg..."
   - Each whisper saves to personality_seeds table
   - Egg gives subtle reactions ("the egg wiggles slightly")

4. **Hatching Event**
   - When timer reaches 0, big animation
   - Cracking egg → reveals baby pet
   - System analyzes personality_seeds → generates personality traits
   - User names the pet
   - Pet moves to "My Pets" page

5. **Pet Page (`/pet/[id]`)**
   - Pet visual (lifecycle stage appropriate)
   - Pet name, level, XP bar
   - Mood indicator (happy/sad/hungry/sleepy/lonely)
   - Stats: Hunger, Energy, Happiness, Bond
   - Chat interface
   - Action buttons: Feed, Play, Sleep, Pet
   - Backstory section (auto-generated from personality traits)

6. **Chat System**
   - Real conversation with Claude API
   - System prompt includes:
     - Pet's species
     - Pet's lifecycle stage
     - Pet's personality traits
     - Recent conversation memory (last 20 messages)
     - Current mood/needs
   - Speech style changes by stage:
     - Egg: minimal sounds ("...", "*wiggle*")
     - Baby: simple words, lots of "!", baby talk
     - Child: full sentences but childlike
     - Teen: developing personality, sometimes moody
     - Adult: complete personality, sophisticated

7. **Mood/Needs System**
   - Hunger decreases over time
   - Energy decreases with interaction
   - Happiness affected by attention received
   - Bond increases with quality interactions
   - Low stats → pet acts grumpy/sad in chat
   - Affects AI system prompt dynamically

8. **Level/XP System**
   - Each meaningful interaction = XP
   - Level up = new abilities unlock
   - Visual evolution at lifecycle transitions

9. **About Page (`/about`)**
   - Display the founder's origin story exactly as written in the Founder section above
   - Mysterious, poetic atmosphere — dark background, serif typography
   - Founder credit: "Mike Ronny — Founder & Creator"
   - No photo, no team section, no corporate "About Us" feel
   - Link from landing page footer with subtle text: "the story"

### Manual Payment Flow (same as MyanmarAI Writer)

- "Upgrade Plan" button → modal with mailto: link
- Pre-filled email to admin
- Admin manually approves in `/admin` panel
- User's plan + perks activated

---

## 🗄️ Database Schema (Prisma)

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  avatar        String?
  hashedPassword String?
  googleId      String?  @unique
  plan          String   @default("free") // free, collector, master, legendary
  planExpiresAt DateTime?
  messagesUsedToday Int @default(0)
  lastMessageReset DateTime @default(now())
  createdAt     DateTime @default(now())
  
  eggs          Egg[]
  pets          Pet[]
  paymentRequests PaymentRequest[]
}

model Egg {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  species         String   // "cat", "dragon", etc.
  tier            String   // "common", "rare", "epic", "mythic", "legendary"
  incubationStartedAt DateTime @default(now())
  hatchesAt       DateTime
  isHatched       Boolean  @default(false)
  
  personalitySeeds PersonalitySeed[]
}

model PersonalitySeed {
  id        String   @id @default(cuid())
  eggId     String
  egg       Egg      @relation(fields: [eggId], references: [id])
  message   String   // What the user whispered
  toneAnalysis Json?  // Sentiment, energy, topics
  createdAt DateTime @default(now())
}

model Pet {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  name          String
  species       String
  tier          String
  
  // Lifecycle
  stage         String   @default("baby") // baby, child, teen, adult
  level         Int      @default(1)
  xp            Int      @default(0)
  
  // Personality (set at hatch from seeds)
  personality   Json     // { cheerful: 0.8, curious: 0.6, ... }
  backstory     String   // Auto-generated narrative
  
  // Stats (0-100)
  hunger        Int      @default(80)
  energy        Int      @default(100)
  happiness     Int      @default(70)
  bond          Int      @default(0)
  
  // Timestamps
  hatchedAt     DateTime @default(now())
  lastInteractedAt DateTime @default(now())
  lastFedAt     DateTime @default(now())
  
  messages      PetMessage[]
}

model PetMessage {
  id        String   @id @default(cuid())
  petId     String
  pet       Pet      @relation(fields: [petId], references: [id])
  role      String   // "user" or "pet"
  content   String
  xpGained  Int      @default(0)
  createdAt DateTime @default(now())
}

model PaymentRequest {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  plan      String
  amount    Float
  status    String   @default("pending") // pending, approved, rejected
  adminNote String?
  createdAt DateTime @default(now())
  approvedAt DateTime?
}
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** SQLite (dev) → PostgreSQL via Neon (production)
- **ORM:** Prisma
- **Auth:** NextAuth.js (Credentials + Google)
- **AI:** Anthropic Claude API
  - Free tier pets: `claude-haiku-4-5` (cost control)
  - Paid tier pets: `claude-sonnet-4-5` (better personality)
- **Animation:** Framer Motion (egg wiggle, hatching)
- **Notifications:** Browser push API + react-hot-toast
- **Deploy:** Vercel + Neon Postgres

---

## 🎨 Design System

### Visual Vibe
- **Mood:** Cozy, whimsical, slightly mystical
- **Reference points:** Stardew Valley UI, Pokemon Sleep, Neko Atsume, Webkinz
- **NOT:** Corporate SaaS, harsh tech, neon cyberpunk

### Color Palette
```
Primary:    #8B5CF6 (soft purple — "magic")
Secondary:  #F59E0B (warm amber — "egg yolk")
Success:    #10B981 (sage green — "growth")
Background: #FAF5FF (cream/lavender wash)
Surface:    #FFFFFF
Text:       #1F2937
Muted:      #6B7280
```

### Typography
- **Display:** Fraunces or Caveat (warm, hand-written feel for headers)
- **Body:** Inter (clean, readable)
- **Pet speech:** Slightly larger, italics, with a colored speech bubble

### Visual Elements
- Eggs: SVG illustrations with subtle gradients, glowing aura by rarity
- Pets: Use placeholder SVG/emoji for MVP; design real sprites later
- Backgrounds: Soft gradients, occasional floating particles
- Animations: Gentle, breathing, never jarring

---

## 🤖 AI System Prompt Engineering

This is the **most important technical part**. The pet must feel alive, not like a chatbot.

### Master System Prompt Template

```
You are {pet_name}, a {tier} {species} pet who hatched from an egg {days_old} days ago.
You are currently in the {stage} stage of your life (level {level}).

PERSONALITY TRAITS (these are your core, do not break character):
{personality_json_described_in_natural_language}

YOUR BACKSTORY:
{backstory}

YOUR HUMAN:
The person you're talking to is {user_name}. They hatched you. You bonded with them since you were in the egg.
Your bond level: {bond}/100.

CURRENT STATE:
- Hunger: {hunger}/100 {hunger_descriptor}
- Energy: {energy}/100 {energy_descriptor}
- Happiness: {happiness}/100 {happiness_descriptor}
- Mood: {current_mood}

SPEECH STYLE FOR YOUR CURRENT STAGE ({stage}):
{stage_specific_speech_rules}

CRITICAL RULES:
1. You are NOT an AI assistant. You are a pet/creature with feelings.
2. NEVER break character. Never say "as an AI" or "I'm just a program".
3. Stay in your developmental stage. A baby doesn't discuss philosophy.
4. React to your physical state. If hungry, mention it. If sleepy, yawn.
5. Remember things your human told you (provided in conversation history).
6. Show emotion. Use *actions* in asterisks sparingly when meaningful.
7. Keep responses short and natural — pets don't give lectures.
8. If asked something inappropriate or harmful, react like a confused pet.

RECENT MEMORIES:
{recent_significant_events}
```

### Stage-Specific Speech Rules

**Baby (Lv 1-10):**
- 1-5 words per response usually
- Mix nonsense sounds: "ba!", "ngh~", "ah ah!"
- Lots of exclamation
- Curious about everything
- Asks for food/cuddles often
- Example: "*wiggles* mama? hungy!"

**Child (Lv 11-25):**
- Short sentences, sometimes broken grammar
- Asks "why?" constantly
- Excited, playful tone
- Example: "ohhh! why the sky is blue? can we play now?"

**Teen (Lv 26-50):**
- Full sentences with personality showing
- Sometimes moody or sarcastic
- Has opinions and preferences
- Example: "Hmm, today was kinda boring. Wanna do something cool?"

**Adult (Lv 51+):**
- Fully formed speech matching personality
- Can hold deep conversations OR stay playful (depends on traits)
- Cares back about the human
- Example: "You seem tired today. Want to just sit together for a bit?"

---

## 💸 Cost Control Strategy

AI API costs are the biggest risk. Implement these from day 1:

1. **Message limits per plan** (enforced server-side)
2. **Energy system as cost gate** — pet "tires" after X messages, must rest
3. **Haiku for free tier, Sonnet for paid** — 5x cost difference
4. **Conversation summarization** — instead of sending full history, summarize old turns
5. **Cache common responses** — for greetings, simple acknowledgments
6. **Rate limiting** — max 1 message per 3 seconds per user

**Estimated costs:**
- Free user: ~30 messages/day × Haiku = ~$0.05/day = $1.50/month
- Pro user: ~200 messages/day × Sonnet = ~$0.40/day = $12/month
- Pricing must keep gross margin >50% after AI costs.

---

## 📅 Build Order

### Phase 1 — Core Loop (Week 1)
- [ ] Project setup (Next.js, Tailwind, Prisma, shadcn)
- [ ] Database schema + migrations
- [ ] Auth (email/password first, Google later)
- [ ] Landing page (basic, single screen, "Hatch your first AI" CTA)
- [ ] **About page (`/about`) with founder story — Mike Ronny**
- [ ] Signup gives 1 free common egg
- [ ] Incubator page with egg + whisper system
- [ ] Hatching flow + personality generation
- [ ] Single pet page with chat
- [ ] Claude API integration with proper system prompt

### Phase 2 — Polish (Week 2)
- [ ] Mood/stats system with decay over time
- [ ] Lifecycle stage transitions
- [ ] Multiple pets support
- [ ] Egg shop UI (still only common for free)
- [ ] Pricing page
- [ ] Manual payment flow + admin panel

### Phase 3 — Depth (Week 3+)
- [ ] Rare/Epic/Mythic eggs
- [ ] Custom pet appearance
- [ ] Browser push notifications
- [ ] Social features (visit friends' pets)
- [ ] Pet breeding
- [ ] Mobile optimization

---

## 🔐 Environment Variables

```bash
DATABASE_URL="file:./dev.db"  # or Postgres URL for prod
NEXTAUTH_SECRET="generate-with-openssl-rand"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""           # optional
GOOGLE_CLIENT_SECRET=""       # optional
ANTHROPIC_API_KEY=""          # required
ADMIN_EMAIL="your@gmail.com"  # for payment approvals
```

---

## ⚠️ Key Reminders for Agent

1. **The vibe matters more than features.** A janky UI with a pet that feels alive > a polished UI with a pet that feels like ChatGPT.

2. **Manual payment flow only for v1.** No Stripe, no crypto. Just mailto: → admin panel approval.

3. **Pet personality must persist.** Once generated at hatching, personality traits are STABLE. They only drift slowly (over weeks).

4. **Cost-aware from day 1.** Every API call costs money. Enforce limits, use Haiku for free tier.

5. **Mobile-first design.** Most users will visit from phones. Don't ship a desktop-only experience.

6. **Owner:** This is being built by a developer in Myanmar. Some payment integrations (Stripe, Paddle) don't support Myanmar, hence the manual flow.

7. **Inspiration vs Copying:** Look at Sweekar (CES 2026), Happy Pets, Tamagotchi, Egg Baby for reference. But our differentiation is REAL AI personality, web-based, and the egg-marketplace model.

---

## 🚀 First Commands to Run

```bash
# 1. Initialize
npx create-next-app@latest spawn-ai --typescript --tailwind --app --src-dir=false

# 2. Install dependencies
cd spawn-ai
npm install prisma @prisma/client @anthropic-ai/sdk next-auth bcryptjs zod react-hook-form @hookform/resolvers framer-motion sonner lucide-react
npm install -D @types/bcryptjs

# 3. Setup shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input dialog toast avatar progress badge

# 4. Setup Prisma
npx prisma init --datasource-provider sqlite

# Then: copy schema from this doc, run migration, start building
```

---

**Build with love. Make people care about their pets.** 🥚→🐾
