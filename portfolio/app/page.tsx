'use client'

import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const ParticleCanvas = dynamic(
  () => import('@/components/ParticleCanvas').then((m) => m.ParticleCanvas),
  { ssr: false }
)

// ─── Content ─────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    tag: 'MIKE RONNY',
    heading: ['I build digital', 'products people', 'actually use.'],
    sub: 'Developer & founder, based in Myanmar.',
    cta: null,
  },
  {
    tag: 'THE WORK',
    heading: ['From raw idea', 'to live product.'],
    sub: 'Shipped in days, not months.',
    cta: null,
  },
  {
    tag: "LET'S TALK",
    heading: ['Have a project', 'in mind?'],
    sub: 'Open for collabs, freelance, and new ideas.',
    cta: 'mikeronny18@gmail.com',
  },
]

const PROJECTS = [
  {
    emoji: '📝',
    name: 'DraftWin',
    tag: 'AI · FREELANCE · TOOLS',
    desc: 'AI proposal writer for freelancers. Generate, rewrite, and score winning proposals in seconds.',
    color: '#06b6d4',
    href: 'https://claude-hsmg.vercel.app',
  },
  {
    emoji: '💬',
    name: 'Whispr',
    tag: 'SOCIAL · ANONYMOUS',
    desc: 'Anonymous messaging platform. Get honest messages, reactions, and see who\'s whispering about you.',
    color: '#a78bfa',
    href: 'https://whispr-shh.vercel.app',
  },
  {
    emoji: '🥚',
    name: 'Spawn AI',
    tag: 'AI · PET · GAME',
    desc: 'Buy an egg, whisper to it, and raise a unique AI creature. Each pet grows its own personality.',
    color: '#34d399',
    href: '#',
  },
  {
    emoji: '🎯',
    name: 'ColdDM Scripts',
    tag: 'TOOLS · FREELANCE',
    desc: '30 copy-paste cold DM scripts. Land clients in 60 seconds — no cringe, no guessing.',
    color: '#00c2ff',
    href: 'https://colddm.vercel.app',
  },
  {
    emoji: '⚡',
    name: 'ReadyPrompts',
    tag: 'AI · PRODUCTIVITY',
    desc: '105 AI prompts that actually work — for creators, developers, and marketers.',
    color: '#f59e0b',
    href: 'https://readyprompts.vercel.app',
  },
  {
    emoji: '🧸',
    name: 'Toynar',
    tag: 'AI · IMAGE · FUN',
    desc: 'Upload any photo and turn it into a toy-style illustration with AI. Instant magic.',
    color: '#f472b6',
    href: '#',
  },
]

// ─────────────────────────────────────────────────────────────────────────────

// Sparkle dots arranged around the email link
const SPARKLE_DOTS = [
  { angle: 0,   r: 90,  size: 5, dur: 2.0, delay: 0.0,  color: '#00e5ff' },
  { angle: 40,  r: 110, size: 3, dur: 2.5, delay: 0.35, color: '#ffffff' },
  { angle: 75,  r: 80,  size: 4, dur: 1.8, delay: 0.7,  color: '#00c2ff' },
  { angle: 120, r: 100, size: 3, dur: 2.3, delay: 0.15, color: '#a78bfa' },
  { angle: 160, r: 95,  size: 5, dur: 2.1, delay: 0.55, color: '#00e5ff' },
  { angle: 200, r: 85,  size: 3, dur: 2.4, delay: 0.9,  color: '#ffffff' },
  { angle: 240, r: 105, size: 4, dur: 1.9, delay: 0.3,  color: '#00c2ff' },
  { angle: 280, r: 75,  size: 3, dur: 2.2, delay: 0.65, color: '#a78bfa' },
  { angle: 320, r: 98,  size: 5, dur: 2.0, delay: 0.45, color: '#00e5ff' },
  // outer scattered
  { angle: 20,  r: 140, size: 2, dur: 3.0, delay: 0.2,  color: '#ffffff' },
  { angle: 100, r: 130, size: 2, dur: 2.8, delay: 0.8,  color: '#00c2ff' },
  { angle: 190, r: 145, size: 2, dur: 3.2, delay: 0.4,  color: '#a78bfa' },
  { angle: 300, r: 135, size: 2, dur: 2.9, delay: 0.1,  color: '#ffffff' },
]

function SparkleEmail() {
  return (
    <div style={{ position: 'relative', display: 'inline-block', padding: '20px 0' }}>
      {/* Sparkle dots */}
      {SPARKLE_DOTS.map((d, i) => {
        const rad = (d.angle * Math.PI) / 180
        const x   = Math.cos(rad) * d.r
        const y   = Math.sin(rad) * d.r * 0.55  // flatten vertically
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              top:  `calc(50% + ${y}px)`,
              left: `calc(50% + ${x}px)`,
              width:  d.size,
              height: d.size,
              borderRadius: '50%',
              background: d.color,
              boxShadow: `0 0 ${d.size * 3}px ${d.color}`,
              animation: `sparklePop ${d.dur}s ease-in-out ${d.delay}s infinite`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
        )
      })}

      {/* Email link */}
      <a
        href="mailto:mikeronny18@gmail.com"
        style={{
          display: 'inline-block',
          fontSize: 'clamp(1rem, 3vw, 1.4rem)',
          fontWeight: 900,
          letterSpacing: '-0.01em',
          textDecoration: 'none',
          background: 'linear-gradient(135deg, #00e5ff 0%, #00c2ff 50%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'electricText 4s ease-in-out infinite',
          position: 'relative',
          zIndex: 1,
        }}
      >
        mikeronny18@gmail.com →
      </a>

      {/* Underline glow */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, #00c2ff, #a78bfa, transparent)',
        marginTop: 6,
        opacity: 0.5,
        animation: 'sparklePop 2s ease-in-out infinite',
      }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function getSectionOpacity(idx: number, p: number): number {
  // 3 equal zones (0-0.33, 0.33-0.66, 0.66-1.0), fade 0.1 crossfade
  const FADE = 0.12
  const start = idx / 3
  const end   = (idx + 1) / 3
  if (idx === SECTIONS.length - 1) {
    // last section stays visible till end
    if (p < start - FADE) return 0
    if (p < start)        return easeInOut((p - (start - FADE)) / FADE)
    return 1
  }
  if (p < start - FADE || p > end + FADE) return 0
  if (p < start)  return easeInOut((p - (start - FADE)) / FADE)
  if (p < end)    return 1
  return easeInOut(1 - (p - end) / FADE)
}

// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const progressRef    = useRef(0)
  const [prog, setProg] = useState(0)

  // Scroll → progress (0…1 across the 300vh hero zone)
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('hero-scroll')
      if (!el) return
      const scrollY    = window.scrollY
      const heroHeight = el.offsetHeight - window.innerHeight
      const p          = Math.max(0, Math.min(1, scrollY / heroHeight))
      progressRef.current = p
      setProg(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ── Fixed 3D canvas (z: 0) ─────────────────────────── */}
      <ParticleCanvas progressRef={progressRef} />

      {/* ── Navigation ─────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{ padding: '20px 28px', backdropFilter: 'blur(0px)' }}
      >
        {/* Logo */}
        <span
          className="font-black tracking-tighter text-xl select-none"
          style={{ color: '#fff', letterSpacing: '-0.03em' }}
        >
          MR
        </span>

        {/* Pill nav — desktop only */}
        <div
          className="hidden md:flex items-center gap-0.5 rounded-full px-2 py-1.5"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {['Work', 'About', 'Contact'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="px-5 py-1.5 rounded-full text-sm font-semibold transition-colors"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#fff')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="flex flex-col justify-center gap-[5px] p-1.5"
          style={{ width: 36, height: 36 }}
          aria-label="Menu"
        >
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'rgba(255,255,255,0.7)', borderRadius: 1 }} />
          <span style={{ display: 'block', width: 15, height: 1.5, background: 'rgba(255,255,255,0.7)', borderRadius: 1 }} />
        </button>
      </nav>

      {/* ══════════════════════════════════════════════════════
          HERO — 300 vh scroll zone
      ══════════════════════════════════════════════════════ */}
      <div id="hero-scroll" style={{ height: '300vh', position: 'relative' }}>

        {/* Sticky overlay — stays in view during entire scroll */}
        <div
          className="sticky top-0 flex items-center"
          style={{ height: '100vh', zIndex: 10, pointerEvents: 'none' }}
        >
          <div style={{ paddingLeft: 'clamp(28px, 6vw, 96px)', paddingRight: 'clamp(28px, 6vw, 96px)', maxWidth: 680 }}>
            {SECTIONS.map((s, i) => {
              const opacity   = getSectionOpacity(i, prog)
              const translateY = opacity === 0 ? (prog > (i / 3) ? -20 : 20) : 0
              return (
                <div
                  key={i}
                  style={{
                    position: i === 0 ? 'relative' : 'absolute',
                    top: i === 0 ? undefined : 0,
                    left: 0,
                    paddingLeft: 'clamp(28px, 6vw, 96px)',
                    opacity,
                    transform: `translateY(${translateY}px)`,
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                    pointerEvents: opacity > 0.5 ? 'auto' : 'none',
                  }}
                >
                  {/* Tag */}
                  <p
                    className="text-xs font-bold tracking-[0.22em] uppercase mb-4"
                    style={{ color: '#00c2ff' }}
                  >
                    ✦ {s.tag}
                  </p>

                  {/* Heading */}
                  <h1
                    className="font-black text-white leading-[1.05]"
                    style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', marginBottom: '1.2rem' }}
                  >
                    {s.heading.map((line, li) => (
                      <span key={li} style={{ display: 'block' }}>{line}</span>
                    ))}
                  </h1>

                  {/* Sub */}
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                    {s.sub}
                  </p>

                  {/* CTA (section 3 only) */}
                  {s.cta && (
                    <a
                      href={`mailto:${s.cta}`}
                      className="inline-block font-bold text-sm rounded-full transition-all"
                      style={{
                        padding: '12px 28px',
                        background: 'linear-gradient(135deg, #00c2ff, #0075ff)',
                        color: '#fff',
                        boxShadow: '0 0 30px rgba(0,194,255,0.4)',
                        pointerEvents: 'auto',
                      }}
                    >
                      {s.cta} →
                    </a>
                  )}

                  {/* Scroll hint — section 0 only */}
                  {i === 0 && (
                    <div className="flex items-center gap-3 mt-8" style={{ opacity: 0.35 }}>
                      <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.4)' }} />
                      <span className="text-xs tracking-[0.2em] font-semibold uppercase">Scroll to explore</span>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Scroll progress dots */}
            <div
              style={{
                position: 'absolute',
                right: 'clamp(20px, 4vw, 48px)',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {SECTIONS.map((_, i) => {
                const active = getSectionOpacity(i, prog) > 0.5
                return (
                  <div
                    key={i}
                    style={{
                      width: active ? 6 : 4,
                      height: active ? 6 : 4,
                      borderRadius: '50%',
                      background: active ? '#00c2ff' : 'rgba(255,255,255,0.2)',
                      boxShadow: active ? '0 0 8px rgba(0,194,255,0.8)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          PROJECTS — id="work"
      ══════════════════════════════════════════════════════ */}
      <section
        id="work"
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'transparent',
          padding: 'clamp(60px, 8vw, 120px) clamp(28px, 6vw, 96px)',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className="text-xs font-bold tracking-[0.22em] uppercase mb-3" style={{ color: '#00c2ff' }}>
            ✦ SELECTED WORK
          </p>
          <h2
            className="font-black text-white"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '3rem', lineHeight: 1.1 }}
          >
            Products I&apos;ve built
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 16,
            }}
          >
            {PROJECTS.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl transition-all duration-300"
                style={{
                  padding: '28px 26px',
                  background: 'rgba(4,6,14,0.72)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.border = `1px solid ${p.color}55`
                  el.style.background = `rgba(4,6,14,0.6)`
                  el.style.transform = 'translateY(-4px)'
                  el.style.boxShadow = `0 0 40px ${p.color}20`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.border = '1px solid rgba(255,255,255,0.08)'
                  el.style.background = 'rgba(4,6,14,0.72)'
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 18 }}>{p.emoji}</div>
                <p
                  className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
                  style={{ color: p.color }}
                >
                  {p.tag}
                </p>
                <h3
                  className="font-black text-white mb-3"
                  style={{ fontSize: '1.25rem' }}
                >
                  {p.name}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {p.desc}
                </p>
                <div
                  className="flex items-center gap-1.5 mt-5 text-xs font-bold"
                  style={{ color: p.color }}
                >
                  View project <span>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CONTACT — id="contact"
      ══════════════════════════════════════════════════════ */}
      <section
        id="contact"
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'transparent',
          padding: 'clamp(60px, 8vw, 120px) clamp(28px, 6vw, 96px)',
          textAlign: 'center',
        }}
      >

        <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative' }}>
          <p className="text-xs font-bold tracking-[0.22em] uppercase mb-4" style={{ color: '#00c2ff' }}>
            ✦ CONTACT
          </p>
          <h2
            className="font-black text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1.2rem' }}
          >
            Let&apos;s build<br />
            <span
              style={{
                background: 'linear-gradient(135deg, #00e5ff 0%, #00c2ff 45%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              something great.
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '3rem', fontSize: '1rem' }}>
            Open for new projects, collabs, and ideas.
          </p>

          {/* ── Sparkle CTA ─────────────────────────── */}
          <SparkleEmail />
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(4,6,14,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '28px clamp(28px, 6vw, 96px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span className="font-black text-white" style={{ letterSpacing: '-0.02em' }}>MR</span>
        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.75rem' }}>
          © 2025 Mike Ronny · Built with Next.js
        </p>
      </footer>
    </>
  )
}
