---
name: mobile-ux
description: Mobile-first UX checklist and patterns for iPhone testing. Mike tests on iPhone 12 (390px). Always verify touch targets, spacing, font sizes, and scroll behavior on mobile.
---

# Mobile UX — iPhone 12 Standard (390px)

## Rules Mike Always Follows
- **Mobile-first**: Design for 390px, then scale up
- **Max width**: `max-w-xl mx-auto` (672px) for content
- **Touch targets**: Minimum 44x44px for all buttons
- **Font sizes**: Min 14px for body, 12px for captions
- **Padding**: Min px-4 (16px) horizontal padding

## Common Mistakes to Fix

```tsx
// ❌ Bad — tiny touch target
<button className="text-xs">Click</button>

// ✅ Good — proper touch target
<button className="text-xs px-4 py-3 rounded-xl">Click</button>

// ❌ Bad — grid breaks on mobile
<div className="grid grid-cols-3">

// ✅ Good — stacks on mobile
<div className="grid grid-cols-1 sm:grid-cols-3">

// ❌ Bad — text too small
<p className="text-xs leading-tight">Long paragraph text</p>

// ✅ Good — readable on mobile  
<p className="text-sm leading-relaxed">Long paragraph text</p>
```

## Checklist Before Shipping

### Layout
- [ ] No horizontal scroll on 390px
- [ ] All buttons min 44px tall
- [ ] Text readable without zooming
- [ ] Forms have proper input types (email, tel, password)

### Navigation
- [ ] Back button / close button easy to reach (bottom of screen)
- [ ] Modals closeable by tapping backdrop
- [ ] Sticky elements don't cover content

### Performance
- [ ] No layout shift on load (set image dimensions)
- [ ] Fonts load without FOUT (flash of unstyled text)
- [ ] Tap response < 100ms

### Forms
```tsx
// Mobile keyboard optimization
<input type="email" autoComplete="email" />
<input type="tel" autoComplete="tel" />
<input type="password" autoComplete="current-password" />
// inputMode for number-only
<input inputMode="numeric" pattern="[0-9]*" />
```

## iPhone 12 Safe Areas
```css
/* For fixed bottom elements */
padding-bottom: env(safe-area-inset-bottom);
```
