# Animation & Motion Design Skill

## Mike's Stack
Pure CSS + vanilla JS animations (no Framer Motion unless explicitly added).
Tailwind CSS for keyframes. React state for trigger-on-scroll.
Performance budget: animations must not affect Core Web Vitals.

## Core Animation Patterns

### Fade-Up on Scroll (Intersection Observer)
```tsx
// Hook
function useFadeUp(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// Usage
const { ref, visible } = useFadeUp();
<div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
```

### Count-Up Animation
```tsx
function CountUp({ to, duration = 1500 }: { to: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useFadeUp();
  useEffect(() => {
    if (!visible) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * to));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, to, duration]);
  return <span ref={ref}>{count}</span>;
}
```

### Glow Pulse on Button
```css
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(249,115,22,0.3); }
  50% { box-shadow: 0 0 50px rgba(249,115,22,0.7), 0 0 80px rgba(249,115,22,0.3); }
}
.btn-glow { animation: glowPulse 2.5s ease-in-out infinite; }
```

### Gradient Border Animation
```css
@keyframes borderRotate {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.gradient-border {
  background: linear-gradient(270deg, #f97316, #3b82f6, #f97316);
  background-size: 400% 400%;
  animation: borderRotate 4s ease infinite;
  padding: 1px; /* shows as border */
  border-radius: 16px;
}
```

### Floating Particles (Canvas-free, pure CSS)
```tsx
// Generate N dots with random positions + animation delays
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 3 + 4,
  color: i % 2 === 0 ? '#f97316' : '#3b82f6',
}));

// CSS: opacity oscillates 0.2 → 0.8, position floats ±10px
```

### Staggered Children Animation
```tsx
// Add delay per child for cascading effect
{items.map((item, i) => (
  <div key={i} style={{ 
    animationDelay: `${i * 100}ms`,
    animation: 'fadeUp 0.6s ease forwards',
    opacity: 0
  }}>
```

### Scroll-Triggered Sticky Bar
```tsx
const [showSticky, setShowSticky] = useState(false);
useEffect(() => {
  const handleScroll = () => setShowSticky(window.scrollY > 500);
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Render: fixed bottom bar with transform translateY
<div style={{
  position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
  transform: showSticky ? 'translateY(0)' : 'translateY(100%)',
  transition: 'transform 0.3s ease',
  padding: '12px 20px',
  background: 'rgba(5,8,15,0.95)',
  backdropFilter: 'blur(12px)',
  borderTop: '1px solid rgba(249,115,22,0.3)',
}}>
```

## Performance Rules
- Use `transform` and `opacity` only (GPU-accelerated, no layout reflow)
- Add `will-change: transform` sparingly (only on elements that always animate)
- Use `passive: true` on scroll listeners
- Use IntersectionObserver instead of scroll event for fade-in triggers
- Cap particles at 20 max (more tanks mobile performance)
- Test on iPhone 12 — if animation stutters, reduce or remove

## Cinema Color Palette for Animations
- Orange glow: `rgba(249, 115, 22, 0.4)` — CTAs, active states
- Blue glow: `rgba(59, 130, 246, 0.35)` — accents, secondary
- Background base: `#05080f`
- Never animate background-color (causes reflow)

## Tailwind Keyframe Config (add to tailwind.config.ts)
```ts
keyframes: {
  fadeUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
  fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
  float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
  glowPulse: { '0%, 100%': { boxShadow: '0 0 20px rgba(249,115,22,0.3)' }, '50%': { boxShadow: '0 0 50px rgba(249,115,22,0.6)' } },
  shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
},
animation: {
  'fade-up': 'fadeUp 0.6s ease-out forwards',
  'fade-in': 'fadeIn 0.4s ease-out forwards',
  float: 'float 3s ease-in-out infinite',
  'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
  shimmer: 'shimmer 2s linear infinite',
}
```
