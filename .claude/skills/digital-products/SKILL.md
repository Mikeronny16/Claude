# Digital Products Skill

## Mike's Business Model
- Sell digital downloads ($2-$10) via crypto (NOWPayments)
- Instant delivery after payment confirmation
- No physical goods, no subscriptions, no Stripe
- Target: SE Asia creators, freelancers, business owners

## Product Types Mike Builds
1. **Prompt kits** — AI prompts (ReadyPrompts model)
2. **Script packs** — Cold DM/email templates (ColdDM model)
3. **Code templates** — HTML/CSS files (LinkBioKit model)
4. **Spreadsheet tools** — Google Sheets calculators
5. **PDF guides** — Reference sheets, rate cards

## Delivery Architecture (Proven Pattern)
```
User clicks Buy → POST /api/payment/create → NOWPayments invoice
→ User pays crypto → NOWPayments success_url redirect
→ /thank-you?payment_id=xxx → poll /api/payment/status every 5s
→ Status "finished" → show download button
→ GET /api/download?payment_id=xxx&token=HMAC → stream file
```

## Pricing Psychology for SE Asia
- $2 = impulse buy (no hesitation for most)
- $5 = needs clear ROI statement ("saves 5 hours = worth it")
- $10 = needs strong social proof + testimonials
- Never price at $4.99 or $9.99 — use round numbers ($2, $5, $10)
- Show crossed-out higher price always (anchor pricing)

## Product Naming Formula
`[Outcome] + [Format]` 
Examples:
- ReadyPrompts (ready to use + prompts)
- ColdDM (cold outreach + DM scripts)
- LinkBioKit (link in bio + kit)

## Content Strategy for Each Product
- Minimum viable: 50+ items (buyers feel they're getting a lot)
- Organize into 4-6 categories (makes it scannable)
- Include: title + content + usage hint per item
- File format: .txt (universal) or PDF (premium feel)
- Bonus items increase perceived value (add 5-10 "bonus" items)

## NOWPayments Integration Pattern
```ts
// Create invoice
POST https://api.nowpayments.io/v1/invoice
{
  price_amount: 2,
  price_currency: "usd",
  pay_currency: "usdtbsc",  // default
  order_id: `product_${Date.now()}`,
  success_url: `${APP_URL}/thank-you`,
  cancel_url: `${APP_URL}/?cancelled=1`,
}

// Check status
GET https://api.nowpayments.io/v1/payment/${payment_id}
// finished | confirmed | partially_paid = PAID
// waiting | confirming | sending = PENDING
// failed | expired = FAILED

// Secure download token
HMAC-SHA256(payment_id + DOWNLOAD_SECRET)
```

## Admin Panel Pattern
Every product needs /admin with:
- Password protection (ADMIN_PASSWORD env var)
- Revenue total + payment count
- Recent payments list with status
- Product content preview (what buyers receive)

## Launch Checklist for New Digital Product
- [ ] Product content written (50+ items minimum)
- [ ] Landing page: hero + pain + solution + pricing + FAQ
- [ ] NOWPayments connected + tested
- [ ] Thank-you + download page working
- [ ] Admin panel working
- [ ] .env.local has all 3 vars (API key, APP_URL, DOWNLOAD_SECRET)
- [ ] Mobile tested at 390px (iPhone 12)
- [ ] Build passes (`npm run build`)
- [ ] Deployed to Vercel with real env vars
- [ ] Test purchase with small amount ($1 or use sandbox)

## Vercel Env Vars (Standard for Mike's Projects)
```
NOWPAYMENTS_API_KEY = (from account.nowpayments.io → API keys)
NEXT_PUBLIC_APP_URL = https://[project].vercel.app
DOWNLOAD_SECRET     = [project]_secret_[year]
ADMIN_PASSWORD      = (Mike sets this)
```

## Common Mistakes to Avoid
- Don't use Google Drive for delivery (complexity, can revoke access)
- Don't require email signup to download (adds friction)
- Don't use fake countdown timers (destroys trust on refresh)
- Don't hide price until checkout (increases bounce rate)
- Don't forget `export const dynamic = "force-dynamic"` on API routes
