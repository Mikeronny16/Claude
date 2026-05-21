---
name: seo-optimizer
description: Add complete SEO to any Next.js page — meta tags, Open Graph, Twitter cards, structured data, sitemap. Use when building or improving any public-facing page.
---

# SEO Optimizer

For every public page, add full SEO in `app/layout.tsx` or per-page `generateMetadata()`.

## Next.js 16 Metadata Template

```tsx
export const metadata: Metadata = {
  title: "Page Title | Site Name",
  description: "150 chars max. Include main keyword naturally.",
  keywords: ["keyword1", "keyword2"],
  openGraph: {
    title: "Page Title",
    description: "OG description — shows on Facebook, WhatsApp, iMessage",
    url: "https://yoursite.vercel.app",
    siteName: "Site Name",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Site preview" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Title",
    description: "Twitter description",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  canonical: "https://yoursite.vercel.app",
};
```

## Mike Ronny Projects

### Whispr
```tsx
title: "Whispr — What do people really think of you?"
description: "Create your free anonymous link. Get honest messages from people who know you."
url: "https://whispr-shh.vercel.app"
```

### DraftWin
```tsx
title: "DraftWin — Write Winning Proposals in 30 Seconds"
description: "AI-powered proposal writer. Win more clients. Used by 500+ freelancers."
url: "https://claude-hsmg.vercel.app"
```

## OG Image
Create `/public/og-image.png` — 1200x630px, dark background, bold text, brand colors.

## Checklist
- [ ] title (50-60 chars)
- [ ] description (150-160 chars)
- [ ] og:image (1200x630)
- [ ] canonical URL
- [ ] robots: index, follow
- [ ] sitemap.xml
