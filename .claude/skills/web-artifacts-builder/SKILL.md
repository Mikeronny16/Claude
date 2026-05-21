---
name: web-artifacts-builder
description: Suite of tools for creating elaborate, multi-component HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex UI prototypes, dashboards, landing pages, and interactive demos.
---

# Web Artifacts Builder

Build powerful React artifacts with:
- React 18 + TypeScript
- Tailwind CSS
- shadcn/ui components (40+)
- Framer Motion animations

## Mike Ronny Stack

For Mike's projects, always use:
```
Framework: Next.js 16 App Router
Styling: Tailwind CSS + custom CSS variables
Theme: Ocean Dark (#040d1a, #06b6d4)
Font: Plus Jakarta Sans
Animation: CSS keyframes (float-slow, slideUp, fadeIn, glowPulse)
DB: Supabase
Deploy: Vercel
```

## Design Anti-Patterns to AVOID

- ❌ Purple gradients on white
- ❌ Generic Inter/Roboto fonts
- ❌ Centered everything with no visual interest
- ❌ Cookie-cutter card layouts
- ❌ Flat, boring color schemes

## Component Template (Ocean Dark)

```tsx
<div style={{
  background: "linear-gradient(135deg, #040d1a, #061525)",
  border: "1px solid rgba(6,182,212,0.15)",
  borderRadius: "1.5rem",
  padding: "1.5rem",
  backdropFilter: "blur(12px)",
}}>
  {/* content */}
</div>
```

## Shadcn/ui Available Components

Button, Card, Dialog, Dropdown, Form, Input, Label, Select, Tabs, Toast, Tooltip, Badge, Avatar, Progress, Skeleton, Switch, Textarea, and 25+ more.
