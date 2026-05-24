import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { SITE } from "@/config"

const HERO_IMG = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80"

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Parallax background */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <img
          src={HERO_IMG}
          alt="Sinar Fashion"
          className="w-full h-[120%] object-cover object-top"
          style={{ marginTop: "-10%" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/40 to-forest" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/50 via-transparent to-forest/50" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        style={{ opacity }}
      >
        {/* Floating NEW COLLECTION badge */}
        <motion.div
          className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-pink/10 border border-pink/30 text-pink text-[11px] tracking-[0.4em] uppercase font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          style={{
            animation: "float 3s ease-in-out infinite",
            animationDelay: "3s",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
          New Collection 2025
        </motion.div>

        {/* Main title - stagger reveal */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            className="font-serif text-7xl sm:text-8xl lg:text-[10rem] xl:text-[12rem] font-black leading-none text-cream tracking-tight"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 2.3, ease: [0.16, 1, 0.3, 1] }}
          >
            SINAR
          </motion.h1>
        </div>

        {/* Divider line */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-pink to-transparent my-5"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.0, delay: 2.6, ease: [0.76, 0, 0.24, 1] }}
        />

        {/* Myanmar tagline */}
        <div className="overflow-hidden">
          <motion.p
            className="font-mm text-xl sm:text-2xl text-cream/90 mb-2"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 2.7 }}
          >
            {SITE.tagline}
          </motion.p>
        </div>

        <motion.p
          className="font-mm text-muted text-sm sm:text-base max-w-md mx-auto mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.0 }}
        >
          ရွေးချယ်ထားသော ချစ်စရာ ဝတ်စုံလေးများ — DM ဖြင့် မှာယူနိုင်ပါသည်
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.2 }}
        >
          <a
            href="#shop"
            className="group relative flex items-center gap-2 bg-pink text-white px-8 py-3.5 rounded-full text-sm font-semibold overflow-hidden hover:shadow-pink transition-shadow duration-300"
          >
            <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-full" />
            <span className="relative font-mm">ဝတ်စုံများကြည့်ရန်</span>
          </a>
          <a
            href={SITE.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-glass border border-hairline text-cream px-8 py-3.5 rounded-full text-sm font-medium hover:border-pink transition-colors duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook Page</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#marquee"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted hover:text-pink transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 0.8 }}
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-pink to-transparent"
          animate={{ scaleY: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </motion.a>

      {/* Side decorative text */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="writing-vertical text-[9px] tracking-[0.5em] text-muted/40 uppercase" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          Myanmar Fashion Brand 2025
        </div>
      </div>
    </section>
  )
}
