'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const RobotScene = dynamic(() => import('./components/RobotScene'), { ssr: false })

const ACCENT = "#FF6B00"
const ACCENT_RGBA = "rgba(255,107,0,"

const PROJECTS = [
  {
    name: 'Ronnix AI',
    tag: 'AI · MYANMAR · SAAS',
    desc: '11 AI tools for Myanmar online sellers — captions, live scripts, promo posts, hashtags & more. 5-second content generation in Myanmar & English.',
    href: 'https://ronnixai.vercel.app',
    dark: true,
    year: '2025',
    live: true,
  },
  {
    name: 'DraftWin',
    tag: 'AI · FREELANCE · SAAS',
    desc: 'AI proposal writer that wins jobs. Tailored for Upwork, Fiverr, LinkedIn & Email. Score ring, snippet vault, rewriter — used by 1,200+ freelancers.',
    href: 'https://claude-hsmg.vercel.app',
    dark: false,
    year: '2025',
    live: true,
  },
  {
    name: 'Whispr',
    tag: 'SOCIAL · ANONYMOUS',
    desc: 'Anonymous message platform. Share your link, get 100% honest messages with mood tags, reactions, leaderboard & streak system.',
    href: 'https://whispr-shh.vercel.app',
    dark: true,
    year: '2025',
    live: true,
  },
  {
    name: 'TikCheck',
    tag: 'CREATOR TOOLS · AI',
    desc: 'The all-in-one viral toolkit for TikTok creators. Score videos, generate hooks, captions, hashtags, and plan 30 days of content.',
    href: '#',
    dark: false,
    year: '2025',
    live: true,
  },
  {
    name: 'Sinar Clothing',
    tag: 'E-COMMERCE · FASHION',
    desc: 'Editorial-style fashion catalog for a Myanmar boutique brand. Supabase-powered product management, bilingual UI, and cinematic scroll animations.',
    href: '#',
    dark: true,
    year: '2025',
    live: true,
  },
  {
    name: 'ColdDM Scripts',
    tag: 'FREELANCE · TOOLS',
    desc: '30 copy-paste cold DM scripts. Land clients in 60 seconds. No cringe, no guessing — just messages that actually get replies.',
    href: 'https://colddm.vercel.app',
    dark: false,
    year: '2024',
    live: true,
  },
  {
    name: 'ReadyPrompts',
    tag: 'AI · PRODUCTIVITY',
    desc: '105 AI prompts that actually work — for creators, developers, and marketers. Built for people who ship, not theorize.',
    href: 'https://readyprompts.vercel.app',
    dark: true,
    year: '2024',
    live: true,
  },
  {
    name: 'Toynar',
    tag: 'AI · IMAGE · FUN',
    desc: 'Upload your photo, AI transforms you into a collectible toy figure in seconds. No account needed.',
    href: '#',
    dark: false,
    year: '2025',
    live: true,
  },
  {
    name: 'Spawn AI',
    tag: 'AI · PET · GAME',
    desc: 'A quiet experiment in caring. Buy an egg, whisper to it, raise a unique AI creature with its own personality.',
    href: '#',
    dark: true,
    year: '2025',
    live: false,
  },
]

const SKILLS = ['Next.js 16', 'TypeScript', 'Groq AI API', 'Framer Motion', 'Tailwind CSS', 'Supabase', 'React Three Fiber', 'Vite']

// ── Text scramble component ──────────────────────────────
const SCRAMBLE_CHARS = '!<>_\\/[]{}—=+*^?#▒░'

function useScramble(text: string, delay = 0) {
  const [output, setOutput] = useState(text)

  useEffect(() => {
    let frameId: number
    let frame = 0
    const totalFrames = 28

    const timer = setTimeout(() => {
      const tick = () => {
        setOutput(
          text.split('').map((char, i) => {
            if (char === ' ') return ' '
            if (frame >= totalFrames * ((i + 1) / text.length)) return char
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          }).join('')
        )
        frame++
        if (frame <= totalFrames) frameId = requestAnimationFrame(tick)
        else setOutput(text)
      }
      tick()
    }, delay)

    return () => { clearTimeout(timer); cancelAnimationFrame(frameId) }
  }, [text, delay])

  return output
}

// ── Animated dot grid hero background ───────────────────
function HeroBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {/* Dot pattern, masked to right/center */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(${ACCENT_RGBA}0.2) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
        maskImage: 'radial-gradient(ellipse 75% 90% at 65% 45%, black 0%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 75% 90% at 65% 45%, black 0%, transparent 75%)',
      }} />
      {/* Main ambient orb near avatar */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '5%', right: '8%',
          width: 'clamp(220px, 38vw, 480px)',
          height: 'clamp(220px, 38vw, 480px)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ACCENT_RGBA}0.09) 0%, transparent 70%)`,
          filter: 'blur(70px)',
        }}
      />
      {/* Secondary orb */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{
          position: 'absolute', bottom: '15%', left: '5%',
          width: 'clamp(120px, 20vw, 280px)',
          height: 'clamp(120px, 20vw, 280px)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ACCENT_RGBA}0.06) 0%, transparent 70%)`,
          filter: 'blur(50px)',
        }}
      />
      {/* Subtle horizontal scan line */}
      <motion.div
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${ACCENT_RGBA}0.06), transparent)`,
        }}
      />
    </div>
  )
}

// ── Project card with Vanilla-Tilt ───────────────────────
function ProjectCard({ p, i }: { p: typeof PROJECTS[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let initialized = false

    import('vanilla-tilt').then(({ default: VanillaTilt }) => {
      if (!el) return
      VanillaTilt.init(el as HTMLElement, {
        max: 8, speed: 600,
        glare: true, 'max-glare': 0.07,
        scale: 1.015, gyroscope: false,
      })
      initialized = true
    }).catch(() => {})

    return () => {
      if (initialized && (el as any).vanillaTilt) (el as any).vanillaTilt.destroy()
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
      style={{
        borderRadius: 20,
        background: p.dark ? '#111' : '#161616',
        border: p.dark
          ? '1px solid rgba(255,255,255,0.06)'
          : `1px solid ${ACCENT_RGBA}0.12)`,
        transformStyle: 'preserve-3d',
        cursor: p.live ? 'pointer' : 'default',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Hover top-edge glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: p.dark
          ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)'
          : `linear-gradient(90deg, transparent, ${ACCENT_RGBA}0.3), transparent)`,
        pointerEvents: 'none',
      }} />

      <a
        href={p.href}
        target={p.live ? '_blank' : undefined}
        rel="noopener noreferrer"
        style={{ display: 'block', textDecoration: 'none', color: '#fff', padding: 'clamp(20px, 3vw, 28px)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: p.dark ? '#3a3a3a' : '#444' }}>
                {p.tag}
              </span>
              {!p.live && (
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                  background: `${ACCENT_RGBA}0.12)`, color: ACCENT,
                  border: `1px solid ${ACCENT_RGBA}0.22)`, borderRadius: 100, padding: '2px 8px',
                }}>SOON</span>
              )}
            </div>
            <h3 style={{
              fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 700,
              letterSpacing: '-0.035em', lineHeight: 1.05, marginBottom: 10,
              transform: 'translateZ(20px)',
            }}>{p.name}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#444', maxWidth: 520 }}>{p.desc}</p>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'right', paddingTop: 4 }}>
            <p style={{ fontSize: 11, color: '#2a2a2a', fontWeight: 600 }}>{p.year}</p>
            {p.live && <div style={{ marginTop: 20, fontSize: 16, color: '#333' }}>→</div>}
          </div>
        </div>
      </a>
    </motion.div>
  )
}

// ── Main page ────────────────────────────────────────────
export default function HomePage() {
  const headline1 = useScramble('Designing & building', 400)
  const headline2 = useScramble('for the creator', 700)
  const headline3 = useScramble('economy.', 1000)

  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh', color: '#fff' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 28px',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(10,10,10,0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.03em' }}>MR</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 6,
            border: `1px solid ${ACCENT_RGBA}0.3)`, borderRadius: 100,
            padding: '4px 12px', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.06em', color: ACCENT,
          }}>
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, display: 'inline-block' }}
            />
            Available
          </span>
          <a href="mailto:mikeronny18@gmail.com" style={{
            fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none', letterSpacing: '-0.01em',
          }}>Contact →</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', flexWrap: 'wrap',
        padding: 'clamp(100px, 12vh, 140px) clamp(24px, 6vw, 80px) 60px',
        maxWidth: 1100, margin: '0 auto',
        gap: 32, overflow: 'hidden',
      }}>
        <HeroBackground />

        {/* Left */}
        <div style={{ flex: '1 1 280px', minWidth: 0, position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ marginBottom: 22 }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100,
              padding: '5px 14px', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', color: '#555',
            }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: ACCENT }} />
              CREATOR + DEVELOPER
            </span>
          </motion.div>

          {/* Ghost background name */}
          <div style={{ position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              style={{
                position: 'absolute', top: '-0.18em', left: '-0.04em',
                fontSize: 'clamp(4.5rem, 16vw, 12rem)',
                fontWeight: 700, lineHeight: 0.85,
                color: 'rgba(255,255,255,0.022)',
                letterSpacing: '-0.05em',
                userSelect: 'none', pointerEvents: 'none',
                whiteSpace: 'nowrap', zIndex: 0,
              }}
            >MIKE</motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
              style={{
                position: 'relative', zIndex: 1,
                fontSize: 'clamp(2.4rem, 5.5vw, 4.6rem)',
                fontWeight: 700, lineHeight: 1.06,
                letterSpacing: '-0.04em', margin: 0,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {headline1}<br />
              <span style={{ color: ACCENT }}>{headline2}</span><br />
              {headline3}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(0.87rem, 1.8vw, 0.97rem)',
              color: '#555', lineHeight: 1.75,
              maxWidth: 420, margin: '22px 0 34px',
            }}
          >
            Mike Ronny — Developer &amp; founder from Myanmar. I ship digital tools used by creators across Southeast Asia and beyond.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.48, ease: 'easeOut' }}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
          >
            <motion.a
              href="#work"
              whileHover={{ scale: 1.04, boxShadow: `0 0 32px ${ACCENT_RGBA}0.4)` }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-block', padding: '12px 26px', borderRadius: 100,
                background: ACCENT, color: '#fff',
                fontSize: 13, fontWeight: 700, textDecoration: 'none',
                letterSpacing: '-0.01em', boxShadow: `0 0 20px ${ACCENT_RGBA}0.25)`,
              }}
            >View Work ↓</motion.a>
            <motion.a
              href="mailto:mikeronny18@gmail.com"
              whileHover={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
              style={{
                display: 'inline-block', padding: '12px 26px', borderRadius: 100,
                border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)',
                fontSize: 13, fontWeight: 700, textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
            >Let&apos;s talk</motion.a>
          </motion.div>
        </div>

        {/* Robot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            position: 'relative', zIndex: 1,
            flex: '1 1 260px',
            width: 'clamp(260px, 34vw, 400px)',
            height: 'clamp(460px, 60vw, 640px)',
          }}
        >
          <RobotScene />
        </motion.div>
      </section>

      {/* Work */}
      <section id="work" style={{
        padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px)',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ marginBottom: 40 }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#333', marginBottom: 10 }}>
            SELECTED WORK
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1,
          }}>Products I&apos;ve shipped</h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.name} p={p} i={i} />)}
        </div>
      </section>

      {/* About */}
      <section style={{
        padding: 'clamp(20px, 4vw, 60px) clamp(24px, 6vw, 80px)',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            background: 'linear-gradient(135deg, #121212 0%, #0E0E0E 100%)',
            border: `1px solid ${ACCENT_RGBA}0.14)`,
            borderRadius: 20, padding: 'clamp(28px, 4vw, 48px)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: -80, right: -80,
            width: 260, height: 260, borderRadius: '50%',
            background: `radial-gradient(circle, ${ACCENT_RGBA}0.07) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#333', marginBottom: 16 }}>ABOUT</p>
          <p style={{
            fontSize: 'clamp(1.05rem, 2.2vw, 1.45rem)',
            fontWeight: 600, color: '#bbb', lineHeight: 1.65,
            letterSpacing: '-0.02em', maxWidth: 620,
          }}>
            I build tools for people who create. Based in Myanmar, working at the intersection of AI + creator economy — shipping fast, shipping real.
          </p>
          <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SKILLS.map(s => (
              <span key={s} style={{
                fontSize: 11, fontWeight: 600, color: '#333',
                border: '1px solid #1E1E1E', borderRadius: 100, padding: '5px 13px',
              }}>{s}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact */}
      <section style={{
        padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px) clamp(80px, 10vw, 120px)',
        textAlign: 'center', maxWidth: 700, margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#333', marginBottom: 14 }}>
            GET IN TOUCH
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700,
            letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 14,
          }}>
            Let&apos;s build something<br />
            <span style={{ color: ACCENT }}>together.</span>
          </h2>
          <p style={{ color: '#444', fontSize: 15, marginBottom: 36, lineHeight: 1.6 }}>
            Open for new projects, collabs, and ideas.
          </p>
          <motion.a
            href="mailto:mikeronny18@gmail.com"
            whileHover={{ scale: 1.04, boxShadow: `0 0 50px ${ACCENT_RGBA}0.45)` }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-block', padding: '16px 40px', borderRadius: 100,
              background: ACCENT, color: '#fff',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
              letterSpacing: '-0.01em',
              boxShadow: `0 0 30px ${ACCENT_RGBA}0.3)`,
            }}
          >mikeronny18@gmail.com →</motion.a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '22px clamp(24px, 6vw, 80px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 700, letterSpacing: '-0.03em', fontSize: 15 }}>MR</span>
        <p style={{ color: '#2a2a2a', fontSize: 12 }}>© 2025 Mike Ronny</p>
      </footer>

      <style>{`
        @keyframes float-orb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .js-tilt-glare-inner { background: linear-gradient(0deg, transparent, rgba(255,255,255,0.04)) !important; }
      `}</style>
    </main>
  )
}
