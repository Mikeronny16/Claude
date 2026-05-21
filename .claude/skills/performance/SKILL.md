---
name: performance
description: Optimize Next.js app performance — loading speed, images, fonts, bundle size, Core Web Vitals. Use before final deployment of any project.
---

# Next.js Performance Optimization

## Quick Wins (Always Do)

### Images
```tsx
import Image from "next/image";
// Always use next/image, never <img>
<Image src="/hero.png" width={800} height={400} alt="Hero" priority />
// Add priority for above-fold images
```

### Fonts
```tsx
// In layout.tsx — fonts load once, cached
import { Plus_Jakarta_Sans } from "next/font/google";
const font = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });
```

### Dynamic Imports
```tsx
// Heavy components — load only when needed
const ShareCard = dynamic(() => import("@/components/ShareCard"), { ssr: false });
const html2canvas = await import("html2canvas"); // Already done in Whispr ✅
```

### API Routes
```tsx
export const dynamic = "force-dynamic"; // Always on API routes ✅
```

## Bundle Size
```bash
npm run build  # Check route sizes in output
# Target: < 100kB per page (first load JS)
```

## Core Web Vitals Targets
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## Supabase Query Optimization
```typescript
// Bad — fetches all columns
supabase.from("table").select("*")

// Good — fetch only needed columns
supabase.from("table").select("id, username, created_at")

// Add indexes on filtered columns in Supabase dashboard
```

## Mike Ronny Project Status
- Dynamic imports for html2canvas ✅
- Plus Jakarta Sans via CSS @import (consider next/font migration)
- `force-dynamic` on all API routes ✅
- Turbopack for fast dev builds ✅
