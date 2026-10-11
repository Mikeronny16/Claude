# SINAR CLOTHING — Project Notes
Last updated: 2026-10-11

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

### 🎨 Design — "Sweet Shop" phone-app style (Oct 2026 redesign)
- Bright candy palette: pink `#E0115F`, blush bg `#FFF1F5`, ink `#2A1320`, sun `#FFC83D`
- Fonts: Fredoka (headings) + Plus Jakarta Sans (body) + Noto Sans Myanmar
- Works like a phone app: bottom tab bar, bottom sheets, sticky order button
- On desktop the app shows as a centered phone-width column
- Language toggle MM ↔ EN (Home header pill + Me tab)
- Dark mode, loading screen and cursor follower were removed

### Bottom tabs
| Tab | Route | What it does |
|---|---|---|
| Home | `/` | Pink header + search, flash sale card (live countdown to midnight), category bubbles, Outfit Finder banner, Hot right now grid, New in row, reviews |
| Shop | `/shop` | Search, category chips, sort. Filters live in the URL (`?q=`, `?cat=`, `?sort=`) |
| 💬 (middle) | — | Chat sheet: Messenger, Viber, WhatsApp, phone, Facebook |
| Saved | `/saved` | Wishlist (hearts). Same localStorage keys as the old site, so old saves still show |
| Me | `/me` | Language, "Add to Home Screen" steps, how to order, size guide, contact, about, Admin link |

### Product page (`/p/:id`)
- Big photo, back / share / heart, wobbling "-20%" sticker on sale items
- Flash sale strip with countdown (sale items only)
- Price + "you save", live "X people viewing", stock chip (In stock / Almost gone / Sold out)
- Colour + size pickers. Tapping Order without a size shakes the size row
- Sticky bar: Add to bag + "Messenger နဲ့ မှာမယ်" (copies the order text, then opens Messenger)
- Viber / WhatsApp buttons (WhatsApp gets the order text pre-filled)
- How to order steps + "You may also like" (same category)
- Share uses the product link, so friends land on the right item

### Order bag
- "+" on any card or the bag button on the product page adds the item
- Bag sheet: change size, quantity, remove, total
- "Order on Messenger" copies the whole order list so the customer just pastes it
- Stored in localStorage `sinar_bag`

### Install as app (PWA)
- `public/manifest.webmanifest` + icons (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`)
- Android Chrome: "Install app" button on Me tab. iPhone: Share → Add to Home Screen steps
- Home shows a dismissible "Add Sinar to your phone" banner
- No service worker (avoids old cached versions after deploys)

### Kept from before
- Social proof pop-up ("… မှာလိုက်သည်") — now floats above the tab bar
- Style Quiz (`/style`) and Outfit Finder (`/outfit`) — restyled to the new palette
- Admin panel + login unchanged (still dark forest style)

---

## 📁 Key Files
```
sinar-clothing/
├── public/manifest.webmanifest, icon-*.png, favicon.svg
├── src/
│   ├── config.ts                    ← phone, Facebook, Messenger / Viber / WhatsApp links
│   ├── lib/
│   │   ├── supabase.ts              ← DB client + Product type
│   │   ├── products.ts              ← fallback products + CATEGORIES
│   │   ├── useProducts.ts           ← shared products query + discount helpers
│   │   ├── store.ts                 ← wishlist + order bag (localStorage)
│   │   ├── order.ts                 ← order message text + copy-to-clipboard
│   │   ├── useCountdown.ts          ← flash sale timer (to midnight)
│   │   ├── install.ts               ← Add to Home Screen helpers
│   │   ├── content.ts               ← reviews, order steps, about text
│   │   └── lang.tsx                 ← MM/EN language context
│   ├── pages/
│   │   ├── Home.tsx / Shop.tsx / Saved.tsx / Me.tsx / ProductPage.tsx
│   │   ├── StyleQuiz.tsx            ← /style
│   │   ├── OutfitQuiz.tsx           ← /outfit
│   │   ├── Admin.tsx + Auth.tsx     ← admin (unchanged)
│   └── components/
│       ├── Logo.tsx                 ← used by admin
│       └── app/
│           ├── AppShell.tsx         ← app frame, tab bar, shared sheets
│           ├── TabBar.tsx, Sheet.tsx, BagSheet.tsx, ChatSheet.tsx, SizeGuide.tsx
│           ├── ProductCard.tsx, MiniCard.tsx
│           ├── Garment.tsx          ← drawn clothes for categories / empty states
│           └── SocialProofTicker.tsx
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
- "Notify me when back in stock" for sold-out items
- Product share card (IG Stories format)
- Several photos per product (needs an `images` column in Supabase)
- Per-product SEO tags (needs server rendering or prerender)
- Real analytics via Supabase `page_visits` table
