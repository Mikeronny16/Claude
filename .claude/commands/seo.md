# SEO Command

When Mike says "add SEO" or before final deploy:

## Steps

1. Open `app/layout.tsx`
2. Add full metadata export
3. Create OG image at `public/og-image.png` (1200x630px)
4. Add sitemap

## Metadata Template for Next.js 16

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "[Page Title] | [Site Name]",
  description: "[150 chars — include main keyword]",
  openGraph: {
    title: "[Page Title]",
    description: "[OG description]",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "[Site Name]",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "[Page Title]",
    description: "[Twitter description]",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};
```

## Checklist
- [ ] Title 50-60 characters
- [ ] Description 150-160 characters  
- [ ] OG image exists at /public/og-image.png
- [ ] Site URL correct in env vars
- [ ] All pages have unique titles
