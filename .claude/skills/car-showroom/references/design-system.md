# Design system — automotive luxury (dark)

A cohesive, premium look. Dark, quiet, expensive. One accent. Big type. Real negative space. The opposite of a busy SaaS landing page.

## Fonts (distinctive — do NOT use Inter/Roboto/Arial)

Use `next/font`. Two good free, characterful pairings (pick one and commit):

**Option 1 — modern performance brand**
- Display: **Clash Display** (Fontshare) — tight, confident, automotive.
- Body: **Hanken Grotesk** (Google) — clean, readable.

**Option 2 — editorial luxury**
- Display: **Fraunces** (Google, high optical size) — refined serif, gallery feel.
- Body: **Geist** (Vercel/Google) — neutral, lets the serif lead.

Load Fontshare fonts with `next/font/local` (download the .woff2), Google fonts with `next/font/google`:

```ts
// app/fonts.ts
import { Hanken_Grotesk } from "next/font/google";
import localFont from "next/font/local";

export const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-body" });
export const display = localFont({
  src: "../public/fonts/ClashDisplay-Variable.woff2",
  variable: "--font-display",
  display: "swap",
});
```

For Burmese text, add a Myanmar webfont (e.g. **Noto Sans Myanmar** / **Padauk**) so mixed EN/MM lines render correctly. See `myanmar-and-i18n.md`.

## Color tokens (CSS variables in globals.css)

```css
:root {
  --bg: #0a0a0b;          /* near-black, slightly warm */
  --bg-elev: #121214;     /* cards / elevated surfaces */
  --line: #1f1f23;        /* hairline borders */
  --text: #f4f4f5;        /* primary text */
  --text-dim: #a1a1aa;    /* secondary text */
  --accent: #c9a227;      /* CHANGE to the brand color (gold default) */
  --accent-contrast: #0a0a0b;
}
```

Rules:
- Background dominates. Accent is rare — buttons, one number, the active swatch ring. Never flood with accent.
- Borders are hairline (`1px`, `--line`), never heavy.
- Avoid pure black (#000) and pure white (#fff); use the warm near-black and off-white above.
- NO purple gradients on white. NO neon. NO drop-shadow soup.

## Tailwind config hook

```ts
// tailwind.config.ts -> theme.extend
colors: {
  bg: "var(--bg)", "bg-elev": "var(--bg-elev)", line: "var(--line)",
  text: "var(--text)", "text-dim": "var(--text-dim)",
  accent: "var(--accent)", "accent-contrast": "var(--accent-contrast)",
},
fontFamily: {
  display: ["var(--font-display)", "serif"],
  body: ["var(--font-body)", "sans-serif"],
},
```

## Type scale

- Hero beats: `clamp(2.5rem, 7vw, 6rem)`, display font, tight tracking, `text-balance`.
- Section headings: `clamp(1.75rem, 4vw, 3rem)`.
- Spec numbers: huge — `clamp(3rem, 10vw, 8rem)`, tabular-nums.
- Body: 16–18px, `--text-dim` for support copy.

## Atmosphere

Film grain overlay (subtle, ~3% opacity) over the whole page gives the "shot in a studio" feel:

```css
/* globals.css */
body { background: var(--bg); color: var(--text); }
.grain::after {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 50;
  opacity: .035; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

Add the `grain` class to `<body>`. Also good: a faint radial vignette behind the car, a thin top progress bar tied to scroll, and slow (300–500ms) eased transitions on hover.

## Motion principles

- Scroll-scrub (the car, spec counts): GSAP, `ease: "none"`, let scroll drive it.
- UI micro-interactions (swatches, cards, buttons): Framer Motion, short and snappy (150–250ms), `ease-out`.
- One big orchestrated reveal beats ten scattered ones. Stagger the hero beats.
- Respect `prefers-reduced-motion` everywhere.
