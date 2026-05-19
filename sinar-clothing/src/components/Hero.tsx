import { ShoppingBag, ArrowDown } from "lucide-react"
import { SITE } from "@/config"

export default function Hero() {
  return (
    <section className="gradient-hero min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-blush/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-blush/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <div className="inline-block text-[11px] tracking-[0.4em] text-muted uppercase mb-6 border border-hairline rounded-full px-5 py-2 bg-white/60 backdrop-blur">
          Myanmar Fashion
        </div>

        <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl xl:text-9xl text-ink leading-none mb-4">
          {SITE.name}
        </h1>

        <p className="font-mm text-2xl sm:text-3xl text-deep mt-2 mb-3">{SITE.tagline}</p>
        <p className="text-muted text-sm sm:text-base max-w-md mx-auto font-mm">
          ရွေးချယ်ထားသော ချစ်စရာ ဝတ်စုံလေးများ — DM ဖြင့် မှာယူနိုင်ပါသည်
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#shop"
            className="flex items-center gap-2 bg-deep text-cream px-8 py-3.5 rounded-full text-sm font-medium hover:bg-ink transition-colors shadow-soft"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-mm">ဝတ်စုံများကြည့်ရန်</span>
          </a>
          <a
            href={SITE.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-ink px-8 py-3.5 rounded-full text-sm font-medium hover:bg-blush transition-colors border border-hairline"
          >
            <span className="font-mm">Facebook Page</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#shop" className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted hover:text-ink transition-colors">
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  )
}
