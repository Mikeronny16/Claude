# SINAR CLOTHING — Project Notes
Last updated: 2026-05-30

---

## 🌐 Live Website
- **URL:** https://mikeronny18-5786s-projects.vercel.app
- **Custom domain (if set):** sinar-clothing-eight.vercel.app

---

## ☁️ Vercel Deployment
| Setting | Value |
|---|---|
| GitHub Repo | Mikeronny16/Claude |
| Production Branch | `sinar-standalone` |
| Root Directory | `sinar-clothing` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

**Environment Variables (set in Vercel Dashboard):**
| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | https://yglnoaxtxxaiacstixxg.supabase.co |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | (your supabase anon key) |
| `VITE_ADMIN_PASSWORD` | (your custom password — fallback: `sinar2025`) |

---

## 🗄️ Supabase Database
- **Project URL:** https://yglnoaxtxxaiacstixxg.supabase.co
- **Email:** mikeronny20mike@gmail.com
- **Table:** `products`

### Products Table Columns
| Column | Type | Notes |
|---|---|---|
| id | text / uuid | Primary key |
| name_mm | text | Myanmar name |
| name_en | text | English name |
| category | text | Tops / Cardigans / Dresses / Jeans / Sweaters |
| sizes | text[] | Array e.g. ["S","M","L"] |
| price | integer | ကျပ် |
| original_price | integer | Sale original price (nullable) |
| badge | text | new / hot / sale / low (nullable) |
| status | text | In Stock / Low Stock / Out of Stock |
| sold_out | boolean | |
| image_url | text | |
| sort_order | integer | Display order |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Storage
- Bucket: `product-images` (for admin image uploads)

---

## 🔑 Admin Panel
- **URL:** /admin
- **Login:** /auth
- **Password:** `sinar2025` (default) — change via `VITE_ADMIN_PASSWORD` env var in Vercel
- **Auth method:** localStorage (`sinar_admin_auth = "true"`)

### Admin Features
- Add / Edit / Delete products
- Toggle Sold Out per product
- Set badge (New / Hot / Sale / Almost Gone)
- Set original price for sale items
- Upload product images to Supabase Storage
- Dashboard with product stats
- Analytics (page visit tracking via localStorage)
- Insights tab with bar chart

---

## 📱 Contact / Config
- **Facebook Page:** https://www.facebook.com/share/14anQs8AyMd/
- **Facebook Page ID:** 14anQs8AyMd
- **Phone / Viber / WhatsApp:** +959790543312

File: `src/config.ts`

---

## ✅ Features Implemented

### Shop / Product Cards
- FOMO badges: ✨ New / 🔥 Hot Item / 💸 Sale / ⚡ Almost Gone
- Discount % pill (top-right of card)
- Crossed-out original price display
- Wishlist / Heart button (saved to localStorage)
- Size chips on card image
- Quick View button
- Hover: Order + Quick View slide-up buttons

### Quick View Modal
- Product detail popup (slide up on mobile, centered on desktop)
- Live viewer count ("4 people viewing right now 🟢")
- Share button (native share on mobile / clipboard fallback)
- Discount savings display ("You save X ကျပ် 🎉")
- Status: Low Stock → "⚡ Almost Gone — မှာဖို့ မစောင့်ပါနှင့်"
- Order via: Messenger / Viber / WhatsApp

### Flash Sale Banner
- Pink countdown banner above product grid
- Counts down to midnight every day automatically
- File: `src/components/FlashSaleBanner.tsx`

### Social Proof Ticker
- Floating notification bottom-left: "မေမြတ်နိုး (ရန်ကုန်) မှာလိုက်သည် 🛍️"
- Appears every 30–45 seconds with random Myanmar names + cities
- File: `src/components/SocialProofTicker.tsx`

### Navbar
- Desktop: Shop / About / Contact links + Style Quiz + Outfit Finder + Facebook
- Mobile: Hamburger drawer with all links
- Dark mode toggle (Sun/Moon)
- Language toggle (MM/EN)
- Scroll-triggered glass blur effect

### Style Quiz (`/style`)
- 5 questions → 6 personality types
- Fashion personality result with description
- File: `src/pages/StyleQuiz.tsx`

### Outfit Finder (`/outfit`)
- 3 questions: Occasion → Vibe → Color
- Recommends real products from Supabase by category
- Shows personality title (e.g. "Romantic Dreamer 🌸", "Power Dresser 💼")
- Direct Messenger "မှာရန်" button per recommended product
- File: `src/pages/OutfitQuiz.tsx`

### Other
- Dark mode / Light mode (full site)
- Language toggle: MM ↔ EN
- Full-screen hero with animated text (framer-motion)
- Marquee strip
- Customer reviews section
- About section
- Footer with Facebook / Messenger / Phone links
- Loading screen animation
- Cursor follower (desktop)

---

## 📁 Key Files
```
sinar-clothing/
├── src/
│   ├── config.ts                    ← phone, facebook, site config
│   ├── lib/
│   │   ├── supabase.ts              ← DB client + Product type
│   │   ├── products.ts              ← fallback products (when DB empty)
│   │   ├── lang.tsx                 ← MM/EN language context
│   │   └── theme.tsx                ← dark/light mode context
│   ├── pages/
│   │   ├── Home.tsx                 ← main page
│   │   ├── Admin.tsx                ← admin dashboard
│   │   ├── Auth.tsx                 ← admin login
│   │   ├── StyleQuiz.tsx            ← /style
│   │   └── OutfitQuiz.tsx           ← /outfit
│   └── components/
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── Products.tsx             ← shop section
│       ├── ProductCard.tsx          ← individual product card
│       ├── QuickViewModal.tsx       ← product detail popup
│       ├── FlashSaleBanner.tsx      ← countdown timer
│       ├── SocialProofTicker.tsx    ← "just ordered" notifications
│       ├── CustomerReviews.tsx
│       ├── About.tsx
│       ├── Footer.tsx
│       ├── Logo.tsx
│       ├── LoadingScreen.tsx
│       └── CursorFollower.tsx
└── vercel.json
```

---

## 🛠️ Tech Stack
| | |
|---|---|
| Framework | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Routing | React Router v6 |
| Data fetching | TanStack Query |
| Forms | React Hook Form |
| Toast | Sonner |
| Icons | Lucide React |

---

## 💡 Future Feature Ideas (not yet built)
- Wishlist page at `/wishlist`
- "Notify me when back in stock" for sold-out items
- Product share card (IG Stories format)
- Product detail pages with SEO
- Real analytics via Supabase `page_visits` table
