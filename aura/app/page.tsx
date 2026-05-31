"use client"

import { useRef, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Upload, Camera, ArrowRight } from "lucide-react"

const STEPS = [
  { num: "01", title: "Upload your selfie", desc: "A clear face photo is all we need." },
  { num: "02", title: "Claude reads your aura", desc: "Coloring, vibe, and body shape — analyzed." },
  { num: "03", title: "AI renders 6 real outfits on you", desc: "Not mood boards. Actual looks, on your body." },
]

const STATS = [
  { val: "12K+", label: "Style profiles generated" },
  { val: "6", label: "Real AI looks per session" },
  { val: "~30s", label: "Average generation time" },
]

export default function HomePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setPreview(dataUrl)
      try {
        sessionStorage.setItem("aura_pending_selfie", dataUrl)
      } catch {
        // storage full — proceed without it
      }
    }
    reader.readAsDataURL(file)
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }

  const onDragLeave = () => setDragging(false)

  const handleGenerate = () => {
    router.push("/create")
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#26262B] bg-[#0B0B0D]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <span
            className="font-display text-xl font-bold tracking-widest text-[#F5F5F0]"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.18em" }}
          >
            AURA
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-[#9A9A92] text-sm hover:text-[#F5F5F0] transition-colors hidden sm:block"
            >
              Pricing
            </Link>
            <Link
              href="/create"
              className="btn-primary px-5 py-2 text-sm"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="min-h-screen flex items-center justify-center px-5 pt-20 pb-16">
        {/* Subtle gold ambient */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C8A24B]/4 blur-[140px] pointer-events-none" />

        <div className="relative max-w-2xl mx-auto w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Tag */}
            <div className="inline-block px-4 py-1.5 mb-8 border border-[#C8A24B]/30 rounded-full text-[#C8A24B] text-[10px] font-semibold tracking-[0.2em] uppercase">
              AI Personal Stylist
            </div>

            {/* H1 */}
            <h1
              className="font-display text-[clamp(3rem,10vw,6.5rem)] font-bold leading-[0.92] mb-6 text-[#F5F5F0]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Your Outfit,<br />
              <em className="text-[#C8A24B] not-italic">Generated</em><br />
              On You.
            </h1>

            {/* Sub */}
            <p className="text-[#9A9A92] text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed">
              Upload your selfie. Claude reads your coloring &amp; vibe.<br className="hidden sm:block" />
              Nano Banana renders 6 real outfits — on your body.
            </p>

            {/* Upload zone */}
            {!preview ? (
              <div
                className={`upload-zone rounded-2xl cursor-pointer mx-auto max-w-sm ${dragging ? "dragging" : ""}`}
                style={{ padding: "2.5rem 1.5rem" }}
                onClick={() => fileInputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={onFileChange}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full border border-[#C8A24B]/30 flex items-center justify-center">
                    <Upload size={22} className="text-[#C8A24B]" />
                  </div>
                  <div>
                    <p className="text-[#F5F5F0] font-medium text-sm">Drop your selfie here</p>
                    <p className="text-[#9A9A92] text-xs mt-1">or tap to open camera / gallery</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Camera size={13} className="text-[#9A9A92]" />
                    <span className="text-[#9A9A92] text-xs">Mobile camera supported</span>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-sm"
              >
                <div className="relative rounded-2xl overflow-hidden border border-[#C8A24B]/25 gold-glow mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Your selfie"
                    className="w-full object-cover max-h-72"
                  />
                  <button
                    onClick={() => {
                      setPreview(null)
                      sessionStorage.removeItem("aura_pending_selfie")
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0B0B0D]/70 border border-white/10 flex items-center justify-center text-[#9A9A92] hover:text-[#F5F5F0] transition-colors text-xs"
                  >
                    ✕
                  </button>
                </div>
                <motion.button
                  onClick={handleGenerate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
                >
                  Generate My Looks
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}

            {/* Micro copy */}
            <p className="text-[#9A9A92]/50 text-xs mt-5">
              Free · No login · 6 looks in ~30 seconds
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-5 border-t border-[#26262B]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold text-[#F5F5F0] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              How It Works
            </h2>
            <p className="text-[#9A9A92] text-base">Three steps. Thirty seconds.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className="card-glass rounded-2xl p-8 relative"
              >
                <div
                  className="font-display text-6xl font-bold text-[#C8A24B]/12 absolute top-4 right-5 select-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {step.num}
                </div>
                <div className="text-[#C8A24B] text-sm font-semibold tracking-[0.15em] uppercase mb-3">
                  {step.num}
                </div>
                <h3 className="text-[#F5F5F0] font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-[#9A9A92] text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-16 px-5 border-t border-[#26262B]">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div
                className="font-display text-[clamp(2rem,6vw,3.5rem)] font-bold text-[#C8A24B] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.val}
              </div>
              <div className="text-[#9A9A92] text-xs sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section className="py-20 px-5 border-t border-[#26262B]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-[#F5F5F0] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Start Free. Unlock the Full Glow-Up.
            </h2>
            <p className="text-[#9A9A92] mb-12 text-base">No subscription. Pay once per session.</p>

            <div className="grid sm:grid-cols-2 gap-5 max-w-xl mx-auto">
              {/* Free */}
              <div className="card-glass rounded-2xl p-7 text-left border border-[#26262B]">
                <div className="text-[#9A9A92] text-xs font-semibold tracking-[0.15em] uppercase mb-4">Free</div>
                <div
                  className="font-display text-4xl font-bold text-[#F5F5F0] mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  $0
                </div>
                <p className="text-[#9A9A92] text-sm mb-5">1 look preview — see your aura.</p>
                <Link href="/create" className="btn-ghost px-5 py-2.5 text-sm inline-block text-center w-full">
                  Try Free
                </Link>
              </div>

              {/* Full Glow-Up */}
              <div className="rounded-2xl p-7 text-left border border-[#C8A24B]/30 gold-glow" style={{ background: "rgba(22,22,26,0.85)" }}>
                <div className="text-[#C8A24B] text-xs font-semibold tracking-[0.15em] uppercase mb-4">Full Glow-Up</div>
                <div
                  className="font-display text-4xl font-bold text-[#F5F5F0] mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  $3
                </div>
                <p className="text-[#9A9A92] text-sm mb-1">5,000 MMK · All 6 looks in HD</p>
                <p className="text-[#9A9A92]/60 text-xs mb-5">Pay once. Keep your looks forever.</p>
                <Link href="/pricing" className="btn-primary px-5 py-2.5 text-sm inline-block text-center w-full">
                  See Pricing
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#26262B] py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span
            className="font-display font-bold tracking-widest text-[#F5F5F0]"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.18em" }}
          >
            AURA
          </span>
          <div className="flex gap-6 text-[#9A9A92] text-sm">
            <Link href="/pricing" className="hover:text-[#F5F5F0] transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-[#F5F5F0] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#F5F5F0] transition-colors">Terms</Link>
          </div>
          <p className="text-[#9A9A92]/40 text-xs">© 2025 AURA. AI Personal Stylist.</p>
        </div>
      </footer>
    </div>
  )
}
