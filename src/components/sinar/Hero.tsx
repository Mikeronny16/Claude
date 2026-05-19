import { MessageCircle, Sparkles, ArrowDown } from "lucide-react";
import { LINKS } from "@/lib/sinar-links";
import { FALLBACK_IMG } from "@/lib/sinar-products";

export function Hero() {
  return (
    <section id="home" className="relative pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-24 overflow-hidden gradient-pink">
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-accent/40 blur-3xl" />
      <div className="absolute top-40 -right-24 w-96 h-96 rounded-full bg-deep/20 blur-3xl" />
      <svg className="absolute top-16 right-8 w-16 h-16 text-deep/40 animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 2c2 4 6 4 6 8s-4 6-6 12c-2-6-6-8-6-12s4-4 6-8z" />
      </svg>
      <svg className="absolute bottom-20 left-6 w-12 h-12 text-sage/40 animate-float" style={{ animationDelay: "1.5s" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M12 2L13 9 20 10 13 11 12 18 11 11 4 10 11 9z" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="reveal">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-1.5 rounded-full text-xs sm:text-sm border border-hairline mb-6">
            <Sparkles className="w-3.5 h-3.5 text-deep" />
            <span className="font-mm text-ink">မြစ်ကြီးနားမှ ချစ်စရာ ဝတ်စုံများ</span>
            <span className="text-muted hidden sm:inline">· From Myitkyina</span>
          </div>
          <h1 className="font-serif italic text-6xl sm:text-7xl lg:text-8xl text-ink leading-[0.95] tracking-tight">
            Sinar<br />
            <span className="text-shimmer not-italic font-display">Clothing</span>
          </h1>
          <p className="font-mm text-2xl sm:text-3xl text-ink mt-6 font-semibold leading-snug">
            နူးညံ့ချစ်စရာ ဝတ်စုံလေးများ
          </p>
          <p className="text-base sm:text-lg text-muted mt-2 max-w-md">
            Soft & cute tops, made for you. Korean-inspired, comfy, and quality you can feel.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#shop" className="inline-flex items-center gap-2 bg-deep hover:bg-deep-hover text-white px-6 py-3.5 rounded-full font-medium shadow-soft transition-all hover:scale-[1.03]">
              <span className="font-mm">ဝတ်စုံများကြည့်ရန်</span>
              <span className="opacity-80 text-sm">· Shop Now</span>
              <ArrowDown className="w-4 h-4" />
            </a>
            <a href={LINKS.messenger} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur hover:bg-white text-ink border border-deep/40 hover:border-deep px-6 py-3.5 rounded-full font-medium transition-all hover:scale-[1.03]">
              <MessageCircle className="w-4 h-4 text-deep" />
              <span className="font-mm">Messenger မှာ စုံစမ်းရန်</span>
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm">
            <div><div className="font-serif text-2xl text-ink">1.1K+</div><div className="font-mm text-xs text-muted">ပရိသတ်များ</div></div>
            <div className="w-px h-10 bg-hairline" />
            <div><div className="font-serif text-2xl text-ink">100+</div><div className="font-mm text-xs text-muted">ဝယ်ယူသူများ</div></div>
            <div className="w-px h-10 bg-hairline" />
            <div><div className="font-serif text-2xl text-ink">2024</div><div className="font-mm text-xs text-muted">တည်ထောင်ခဲ့သည်</div></div>
          </div>
        </div>

        <div className="relative reveal">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent to-deep/60 rounded-[2.5rem] rotate-3 scale-[0.97]" />
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-soft aspect-[4/5] bg-white">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&h=1000&q=85"
              alt="Sinar Clothing hero"
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
            />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-3 border border-hairline">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center"><Sparkles className="w-4 h-4 text-sage" /></div>
            <div>
              <div className="font-mm text-xs font-semibold text-ink">အသစ်ရောက်ရှိ</div>
              <div className="text-[10px] text-muted uppercase tracking-wider">New Arrivals</div>
            </div>
          </div>
          <div className="absolute -top-3 -right-3 bg-deep text-white rounded-2xl shadow-soft px-4 py-2.5">
            <div className="font-serif italic text-sm">In Stock</div>
            <div className="font-mm text-[11px] opacity-90">+ Preorder</div>
          </div>
        </div>
      </div>
    </section>
  );
}
