'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const ACCENT = "#FF6B00"
const ACCENT_RGBA = "rgba(255,107,0,"

const PROJECTS = [
  {
    name: 'TikCheck',
    tag: 'CREATOR TOOLS · AI',
    desc: 'The all-in-one viral toolkit for TikTok creators. Score videos, generate hooks, captions, hashtags, and plan 30 days of content.',
    href: '#',
    dark: true,
    year: '2025',
    live: true,
  },
  {
    name: 'ReadyPrompts',
    tag: 'AI · PRODUCTIVITY',
    desc: '105 AI prompts that actually work — for creators, developers, and marketers. Built for people who ship, not theorize.',
    href: 'https://readyprompts.vercel.app',
    dark: false,
    year: '2024',
    live: true,
  },
  {
    name: 'ColdDM Scripts',
    tag: 'FREELANCE · TOOLS',
    desc: '30 copy-paste cold DM scripts. Land clients in 60 seconds. No cringe, no guessing — just messages that actually get replies.',
    href: 'https://colddm.vercel.app',
    dark: true,
    year: '2024',
    live: true,
  },
  {
    name: 'Spawn AI',
    tag: 'AI · PET · GAME',
    desc: 'A quiet experiment in caring. Buy an egg, whisper to it, raise a unique AI creature with its own personality.',
    href: '#',
    dark: false,
    year: '2025',
    live: false,
  },
]

const SKILLS = ['Next.js', 'TypeScript', 'AI APIs', 'Framer Motion', 'Tailwind CSS', 'Prisma']

const inView = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: "easeOut" as const },
}

function Avatar() {
  const [imgError, setImgError] = useState(false)

  if (!imgError) {
    return (
      <img
        src="/mike.jpg"
        alt="Mike Ronny"
        onError={() => setImgError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '50%',
          display: 'block',
        }}
      />
    )
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${ACCENT_RGBA}0.25) 0%, rgba(30,10,0,0.9) 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 'clamp(2.5rem, 8vw, 4rem)',
      fontWeight: 700,
      color: ACCENT,
      letterSpacing: '-0.04em',
    }}>
      MR
    </div>
  )
}

export default function HomePage() {
  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh', color: '#fff' }}>

      {/* ── Nav ───────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 28px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(10,10,10,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.03em' }}>MR</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 6,
            border: `1px solid ${ACCENT_RGBA}0.35)`,
            borderRadius: 100, padding: '4px 12px',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            color: ACCENT,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: ACCENT, display: 'inline-block',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            Available
          </span>
          <a href="mailto:mikeronny18@gmail.com" style={{
            fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)',
            textDecoration: 'none', letterSpacing: '-0.01em',
          }}>
            Contact →
          </a>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: 'clamp(100px, 12vh, 140px) clamp(24px, 6vw, 80px) 60px',
        maxWidth: 1100, margin: '0 auto',
        gap: 48,
      }}>

        {/* Left — text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ marginBottom: 20 }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100,
              padding: '5px 14px', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', color: '#666',
            }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: ACCENT }} />
              CREATOR + DEVELOPER
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
          >
            <div style={{ position: 'relative', marginBottom: 8 }}>
              {/* Giant ghost background name */}
              <div style={{
                position: 'absolute', top: '-0.15em', left: '-0.05em',
                fontSize: 'clamp(5rem, 18vw, 14rem)',
                fontWeight: 700, lineHeight: 0.85,
                color: 'rgba(255,255,255,0.025)',
                letterSpacing: '-0.05em',
                userSelect: 'none', pointerEvents: 'none',
                whiteSpace: 'nowrap', zIndex: 0,
              }}>
                MIKE
              </div>
              <h1 style={{
                position: 'relative', zIndex: 1,
                fontSize: 'clamp(2.6rem, 6vw, 5rem)',
                fontWeight: 700, lineHeight: 1.05,
                letterSpacing: '-0.04em', margin: 0,
              }}>
                Designing &amp; building<br />
                <span style={{ color: ACCENT }}>for the creator</span><br />
                economy.
              </h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              color: '#666', lineHeight: 1.7,
              maxWidth: 440, margin: '20px 0 36px',
            }}
          >
            Mike Ronny — Developer &amp; founder from Myanmar. I ship digital tools used by creators across Southeast Asia and beyond.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26, ease: "easeOut" }}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
          >
            <a href="#work" style={{
              display: 'inline-block', padding: '12px 24px', borderRadius: 100,
              background: ACCENT, color: '#fff',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}>
              View Work ↓
            </a>
            <a href="mailto:mikeronny18@gmail.com" style={{
              display: 'inline-block', padding: '12px 24px', borderRadius: 100,
              border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}>
              Let&apos;s talk
            </a>
          </motion.div>
        </div>

        {/* Right — avatar photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          style={{
            flexShrink: 0,
            width: 'clamp(160px, 26vw, 300px)',
            height: 'clamp(160px, 26vw, 300px)',
            borderRadius: '50%',
            border: `2px solid ${ACCENT_RGBA}0.25)`,
            boxShadow: `0 0 80px ${ACCENT_RGBA}0.12), 0 0 0 1px rgba(255,255,255,0.04)`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Avatar />
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: `radial-gradient(ellipse at 30% 20%, ${ACCENT_RGBA}0.08) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
        </motion.div>
      </section>

      {/* ── Work ──────────────────────────────────────── */}
      <section id="work" style={{
        padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px)',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <motion.div {...inView} style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#444', marginBottom: 10 }}>
            SELECTED WORK
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1,
          }}>
            Products I&apos;ve shipped
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PROJECTS.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.href}
              target={p.live ? '_blank' : undefined}
              rel="noopener noreferrer"
              {...inView}
              transition={{ ...inView.transition, delay: i * 0.07 }}
              whileHover={{ y: -2 }}
              style={{
                display: 'block', textDecoration: 'none',
                padding: 'clamp(20px, 3vw, 28px)',
                borderRadius: 18,
                background: p.dark ? '#141414' : '#1C1C1C',
                border: p.dark
                  ? '1px solid rgba(255,255,255,0.07)'
                  : `1px solid ${ACCENT_RGBA}0.12)`,
                color: '#fff', cursor: p.live ? 'pointer' : 'default',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                      color: p.dark ? '#444' : '#555',
                    }}>
                      {p.tag}
                    </span>
                    {!p.live && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                        background: `${ACCENT_RGBA}0.15)`, color: ACCENT,
                        border: `1px solid ${ACCENT_RGBA}0.25)`,
                        borderRadius: 100, padding: '2px 8px',
                      }}>
                        SOON
                      </span>
                    )}
                  </div>
                  <h3 style={{
                    fontSize: 'clamp(1.3rem, 3vw, 1.9rem)',
                    fontWeight: 700, letterSpacing: '-0.03em',
                    lineHeight: 1.1, marginBottom: 8,
                  }}>
                    {p.name}
                  </h3>
                  <p style={{
                    fontSize: 14, lineHeight: 1.65,
                    color: '#555', maxWidth: 540,
                  }}>
                    {p.desc}
                  </p>
                </div>
                <div style={{ flexShrink: 0, textAlign: 'right', paddingTop: 4 }}>
                  <p style={{ fontSize: 11, color: '#333', fontWeight: 600 }}>{p.year}</p>
                  {p.live && (
                    <div style={{ marginTop: 20, fontSize: 16, color: '#333' }}>→</div>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── About ─────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(40px, 6vw, 80px) clamp(24px, 6vw, 80px)',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <motion.div
          {...inView}
          style={{
            background: '#141414',
            border: `1px solid ${ACCENT_RGBA}0.15)`,
            borderRadius: 20, padding: 'clamp(28px, 4vw, 48px)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 200, height: 200, borderRadius: '50%',
            background: `radial-gradient(circle, ${ACCENT_RGBA}0.08) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#444', marginBottom: 16 }}>
            ABOUT
          </p>
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.55rem)',
            fontWeight: 600, color: '#ccc', lineHeight: 1.6,
            letterSpacing: '-0.02em', maxWidth: 640,
          }}>
            I build tools for people who create. Based in Myanmar, working at the intersection of AI + creator economy — shipping fast, shipping real.
          </p>
          <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SKILLS.map(s => (
              <span key={s} style={{
                fontSize: 11, fontWeight: 600,
                color: '#444', border: '1px solid #222',
                borderRadius: 100, padding: '5px 13px',
              }}>
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Contact ───────────────────────────────────── */}
      <section style={{
        padding: 'clamp(60px, 8vw, 100px) clamp(24px, 6vw, 80px) clamp(80px, 10vw, 120px)',
        textAlign: 'center', maxWidth: 700, margin: '0 auto',
      }}>
        <motion.div {...inView}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#444', marginBottom: 14 }}>
            GET IN TOUCH
          </p>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700, letterSpacing: '-0.04em',
            lineHeight: 1.1, marginBottom: 14,
          }}>
            Let&apos;s build something<br />
            <span style={{ color: ACCENT }}>together.</span>
          </h2>
          <p style={{ color: '#555', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
            Open for new projects, collabs, and ideas.
          </p>
          <motion.a
            href="mailto:mikeronny18@gmail.com"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-block',
              padding: '15px 36px', borderRadius: 100,
              background: ACCENT, color: '#fff',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
              letterSpacing: '-0.01em',
              boxShadow: `0 0 40px ${ACCENT_RGBA}0.3)`,
            }}
          >
            mikeronny18@gmail.com →
          </motion.a>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '22px clamp(24px, 6vw, 80px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 700, letterSpacing: '-0.03em', fontSize: 15 }}>MR</span>
        <p style={{ color: '#333', fontSize: 12 }}>© 2025 Mike Ronny</p>
      </footer>
    </main>
  )
}
