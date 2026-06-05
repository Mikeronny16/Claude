# Myanmar localization & i18n

Launch EN-first if you want, but scaffold bilingual from day one — it's far cheaper than retrofitting.

## Fonts for Burmese

Latin display/body fonts don't render Burmese. Add a Myanmar webfont and apply it to Burmese text. Good free options: **Noto Sans Myanmar**, **Padauk**, **Pyidaungsu**.

```ts
// app/fonts.ts
import { Noto_Sans_Myanmar } from "next/font/google";
export const my = Noto_Sans_Myanmar({
  subsets: ["myanmar"], weight: ["400","500","700"], variable: "--font-my",
});
```

Apply `var(--font-my)` to elements containing Burmese. A simple approach: a `lang="my"` attribute + CSS:

```css
[lang="my"] { font-family: var(--font-my), sans-serif; line-height: 1.7; }
```

Burmese needs a little more line-height than Latin — don't let stacked marks clip.

## Simple dictionary i18n (no heavy library needed)

```ts
// lib/i18n.ts
export const dict = {
  en: {
    bookTestDrive: "Book a test drive",
    lineup: "The lineup",
    makeItYours: "Make it yours",
    scroll: "Scroll",
    name: "Your name",
    phone: "Phone (Viber / Telegram)",
    request: "Request test drive",
    thankYou: "Thank you",
  },
  my: {
    bookTestDrive: "စမ်းသပ်မောင်းနှင်ရန် �‌ဘွတ်ကင်လုပ်မည်",
    lineup: "မော်ဒယ်များ",
    makeItYours: "သင့်စိတ်ကြိုက် ပြင်ဆင်ပါ",
    scroll: "အောက်ဆွဲပါ",
    name: "အမည်",
    phone: "ဖုန်း (Viber / Telegram)",
    request: "စမ်းသပ်မောင်းနှင်ရန် တောင်းဆိုမည်",
    thankYou: "ကျေးဇူးတင်ပါသည်",
  },
} as const;

export type Lang = keyof typeof dict;
export const t = (lang: Lang, key: keyof typeof dict["en"]) => dict[lang][key];
```

Hold the active language in a small context or the URL (`/my`, `/en`) and pass `t(lang, "key")` into components. A language toggle in the header is enough.

## Payments — important Myanmar reality

Stripe / online card checkout is NOT available. So this is a **lead-gen + offline payment** site, not e-commerce checkout:

- Capture the enquiry (TestDriveForm → Supabase).
- Show accepted methods as info: **KBZPay, Wave Money, MMQR** for local; **USDT/crypto** for international.
- Deposits/reservations handled after human contact (Viber/Telegram).
- Do NOT build a card checkout flow — it will not work and looks broken to local users.

## Contact channels

In Myanmar the real conversion happens on **Viber, Telegram, and Facebook/Messenger** — surface these prominently in the footer and after form submit, not just email. Add click-to-chat links:

```
viber://chat?number=%2B95XXXXXXXXX
https://t.me/yourhandle
https://m.me/yourpage
```

## Performance note (mobile data)

Mobile networks here are often slow/metered. This is why the hero MUST fall back to a single poster on mobile (the `cinematic-scroll` component does this automatically) — never push 100+ frames to a phone on mobile data. Keep the whole sequence small (webp, ≤10 MB) even on desktop.
