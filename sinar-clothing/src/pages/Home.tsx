import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Flame, Heart, Search, ShoppingBag, SlidersHorizontal, Star, X, Zap } from "lucide-react"
import { useLang } from "@/lib/lang"
import { CATEGORIES, FALLBACK_IMG } from "@/lib/products"
import { discountPct, useProducts } from "@/lib/useProducts"
import { useBag } from "@/lib/store"
import { formatKs } from "@/lib/order"
import { useMidnightCountdown } from "@/lib/useCountdown"
import { isStandalone } from "@/lib/install"
import { REVIEWS } from "@/lib/content"
import type { Product } from "@/lib/supabase"
import { useAppUI } from "@/components/app/AppShell"
import { CATEGORY_GARMENT, Garment, Sparkle } from "@/components/app/Garment"
import ProductCard, { ProductCardSkeleton, Sticker } from "@/components/app/ProductCard"
import MiniCard from "@/components/app/MiniCard"

const CATEGORY_TONES = ["bg-candy-soft", "bg-candy-butter", "bg-candy-sky", "bg-candy-lilac", "bg-candy-mint"]

const createdAt = (p: Product) => Date.parse(p.created_at ?? "") || 0
const hotScore = (p: Product) =>
  (p.badge === "hot" ? 3 : 0) + (discountPct(p) > 0 ? 2 : 0) + (p.badge === "new" || p.badge === "low" ? 1 : 0)

function SectionTitle({ icon, title, to }: { icon: React.ReactNode; title: string; to?: string }) {
  const { t } = useLang()
  return (
    <div className="flex items-center justify-between px-5 pb-3 pt-7">
      <h2 className="font-display flex items-center gap-1.5 text-[21px] font-semibold">
        {icon}
        {title}
      </h2>
      {to && (
        <Link to={to} className="font-mm -mr-2 flex h-10 items-center px-2 text-[13px] font-extrabold text-candy-pink">
          {t("အားလုံး", "See all")}
        </Link>
      )}
    </div>
  )
}

function Countdown() {
  const { h, m, s } = useMidnightCountdown()
  const box = "flex h-9 w-[34px] items-center justify-center rounded-[10px] text-[15px] font-extrabold tabular-nums text-white"
  return (
    <div className="flex items-center gap-1" aria-label={`${h}:${m}:${s}`}>
      <span className={`${box} bg-candy-ink`}>{h}</span>
      <span className="font-extrabold">:</span>
      <span className={`${box} bg-candy-ink`}>{m}</span>
      <span className="font-extrabold">:</span>
      <span className={`${box} bg-candy-pink`}>{s}</span>
    </div>
  )
}

export default function Home() {
  const { t, lang, toggle } = useLang()
  const navigate = useNavigate()
  const { products, isLoading } = useProducts()
  const bag = useBag()
  const { openBag } = useAppUI()
  const [q, setQ] = useState("")
  const [hideInstall, setHideInstall] = useState(() => {
    try { return isStandalone || localStorage.getItem("sinar_hide_install") === "1" } catch { return isStandalone }
  })

  const available = products.filter((p) => !p.sold_out)
  const sale = available.filter((p) => discountPct(p) > 0).slice(0, 3)
  const byHot = [...available].sort((a, b) => hotScore(b) - hotScore(a))
  // Fill the 3 flash-sale slots with hot picks when fewer than 3 items are discounted
  const flashItems = [...sale, ...byHot.filter((p) => !sale.includes(p))].slice(0, 3)
  const maxOff = Math.max(0, ...sale.map(discountPct))
  const hot = byHot.slice(0, 6)
  const newest = [...products].sort((a, b) => createdAt(b) - createdAt(a)).slice(0, 8)
  const bagCount = bag.reduce((n, i) => n + i.qty, 0)

  function search(e: React.FormEvent) {
    e.preventDefault()
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : "/shop")
  }

  function dismissInstall() {
    setHideInstall(true)
    try { localStorage.setItem("sinar_hide_install", "1") } catch {}
  }

  return (
    <div>
      {/* ── Pink header ── */}
      <header className="pt-safe relative overflow-hidden bg-candy-pink px-5 pb-24">
        <span className="absolute -right-12 -top-14 h-52 w-52 rounded-full bg-white/10" />
        <span className="absolute -left-16 bottom-6 h-36 w-36 rounded-full bg-white/[0.08]" />
        <Sparkle className="absolute left-40 top-6 h-[18px] w-[18px] animate-twinkle text-white" />
        <Sparkle className="absolute left-48 top-14 h-3 w-3 animate-twinkle-slow text-candy-sun" />
        <Sparkle className="absolute bottom-16 right-10 h-3.5 w-3.5 animate-twinkle-slow text-white" />

        <div className="relative flex items-center justify-between pt-3">
          <div>
            <p className="font-mm text-[13px] leading-relaxed text-white/90">{t("မင်္ဂလာပါ", "Hello there")}</p>
            <h1 className="font-display text-[34px] font-bold leading-none text-white">Sinar</h1>
          </div>
          <div className="-mr-2 flex items-center">
            <button
              onClick={toggle}
              aria-label={lang === "mm" ? "Switch to English" : "မြန်မာလို ပြောင်းမယ်"}
              className="flex h-11 items-center px-1.5"
            >
              <span className="font-mm rounded-full border-2 border-white/70 px-2.5 py-0.5 text-xs font-bold text-white">
                {lang === "mm" ? "EN" : "မြန်မာ"}
              </span>
            </button>
            <Link to="/saved" aria-label="Saved" className="flex h-11 w-11 items-center justify-center text-white">
              <Heart className="h-[23px] w-[23px]" strokeWidth={2.2} />
            </Link>
            <button onClick={openBag} aria-label={`Bag, ${bagCount}`} className="relative flex h-11 w-11 items-center justify-center text-white">
              <ShoppingBag className="h-[23px] w-[23px]" strokeWidth={2.2} />
              {bagCount > 0 && (
                <span className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-candy-sun px-1 text-[10.5px] font-extrabold text-candy-ink">
                  {bagCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <form role="search" onSubmit={search} className="relative mt-4">
          <label htmlFor="home-search" className="sr-only">{t("ရှာမယ်", "Search")}</label>
          <Search className="absolute left-4 top-[15px] h-5 w-5 text-candy-muted" strokeWidth={2.2} />
          <input
            id="home-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("ဝတ်စုံ၊ အကျီ ရှာမယ်…", "Search dresses, tops…")}
            className="font-mm h-[50px] w-full rounded-full bg-white pl-12 pr-14 text-[15px] text-candy-ink shadow-[0_6px_18px_rgba(80,0,30,0.18)] outline-none placeholder:text-candy-muted/80"
          />
          <Link
            to="/shop"
            aria-label={t("Filter", "Filters")}
            className="absolute right-[5px] top-[5px] flex h-10 w-10 items-center justify-center rounded-full bg-candy-soft text-candy-pink"
          >
            <SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={2.4} />
          </Link>
        </form>

        <svg viewBox="0 0 390 30" preserveAspectRatio="none" aria-hidden="true" className="absolute -bottom-px left-0 h-[30px] w-full">
          <path d="M0 30 L0 14 Q32 0 65 14 T130 14 T195 14 T260 14 T325 14 T390 14 L390 30 Z" className="fill-candy-bg" />
        </svg>
      </header>

      {/* ── Flash sale card ── */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-4 -mt-[70px] flex flex-col gap-3.5 rounded-[26px] bg-white p-4 shadow-candy"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col items-start gap-1.5">
            {sale.length > 0 ? (
              <span className="flex items-center gap-1 rounded-full bg-candy-sun py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold tracking-wider">
                <Zap className="h-3 w-3" fill="currentColor" /> FLASH SALE
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-candy-soft py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold tracking-wider text-candy-pink">
                <Flame className="h-3 w-3" fill="currentColor" /> HOT PICKS
              </span>
            )}
            <h2 className="font-display text-[21px] font-semibold leading-tight">
              {sale.length > 0
                ? t(`${maxOff}% အထိ လျှော့ဈေး`, `Up to ${maxOff}% off`)
                : t("အခု လူကြိုက်များနေတာ", "Loved right now")}
            </h2>
          </div>
          {sale.length > 0 && <Countdown />}
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {isLoading
            ? [0, 1, 2].map((i) => <div key={i} className="skeleton h-[136px] rounded-2xl" />)
            : flashItems.map((p) => (
                <Link key={p.id} to={`/p/${p.id}`} className="flex min-w-0 flex-col gap-1 active:opacity-90">
                  <span className="relative block h-[104px] overflow-hidden rounded-2xl bg-candy-soft">
                    <img src={p.image_url || FALLBACK_IMG} alt={p.name_en} className="h-full w-full object-cover" />
                    <Sticker p={p} className="absolute left-1.5 top-1.5 -rotate-6 !px-1.5 !text-[10.5px]" />
                  </span>
                  <span className="font-mm truncate text-[13px] font-extrabold text-candy-pink">
                    {p.price > 0 ? formatKs(p.price) : t("ဈေးမေးရန်", "Ask price")}
                  </span>
                  {discountPct(p) > 0 && (
                    <span className="-mt-1 text-[11px] text-candy-muted line-through">{p.original_price!.toLocaleString()}</span>
                  )}
                </Link>
              ))}
        </div>
      </motion.section>

      {/* ── Categories ── */}
      <nav aria-label={t("အမျိုးအစား", "Categories")} className="grid grid-cols-5 gap-1 px-3 pt-5">
        {CATEGORIES.map((c, i) => (
          <Link key={c.key} to={`/shop?cat=${c.key}`} className="flex flex-col items-center gap-1.5 py-0.5 active:scale-95">
            <span className={`flex h-[60px] w-[60px] items-center justify-center rounded-[22px] ${CATEGORY_TONES[i]}`}>
              <Garment kind={CATEGORY_GARMENT[c.key]} className="h-11 w-[34px]" strokeWidth={3} />
            </span>
            <span className="font-mm text-[11.5px] font-bold">{t(c.mm, c.en)}</span>
          </Link>
        ))}
      </nav>

      {/* ── Outfit finder banner ── */}
      <Link to="/outfit" className="relative mx-4 mt-5 block min-h-[156px] overflow-hidden rounded-[26px] bg-candy-lilac p-[18px] active:scale-[0.99]">
        <span className="absolute -bottom-10 -right-8 h-44 w-44 rounded-full bg-[#D9CCFF]" />
        <span className="absolute right-5 top-4 animate-floaty">
          <Garment kind="sweater" className="h-[114px] w-[88px] rotate-[9deg] drop-shadow-[0_10px_8px_rgba(60,30,120,0.2)]" strokeWidth={1.6} />
        </span>
        <Garment kind="top" className="absolute right-[92px] top-[76px] h-[83px] w-16 -rotate-12 drop-shadow-[0_8px_6px_rgba(60,30,120,0.2)]" />
        <span className="relative flex w-[176px] flex-col items-start gap-2">
          <span className="rounded-full bg-white px-2.5 py-1 text-[10.5px] font-extrabold tracking-wider text-[#4B2BB8]">OUTFIT FINDER</span>
          <span className="font-display text-[21px] font-semibold leading-tight">{t("ဘာဝတ်ရမလဲ မသိဘူးလား?", "Not sure what to wear?")}</span>
          <span className="font-mm text-xs leading-relaxed text-[#4A3A66]">
            {t("မေးခွန်း ၃ ခု ဖြေပြီး ကိုယ်နဲ့လိုက်တဲ့ ဝတ်စုံ ရှာမယ်", "Answer 3 quick questions, get outfit picks")}
          </span>
          <span className="mt-0.5 flex h-[42px] items-center gap-1.5 rounded-full bg-candy-ink px-4 text-[13px] font-bold text-white">
            {t("စမယ်", "Start")} <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.6} />
          </span>
        </span>
      </Link>
      <Link to="/style" className="font-mm mx-4 mt-2 flex h-11 items-center justify-center gap-1.5 text-[13px] font-bold text-[#4B2BB8]">
        <Sparkle className="h-3.5 w-3.5" />
        {t("နာမည်နဲ့ Style ဖတ်ကြည့်မယ်", "Read my style from my name")}
      </Link>

      {/* ── Hot right now ── */}
      <SectionTitle icon={<Flame className="h-5 w-5 text-candy-pink" fill="currentColor" />} title={t("အခု Hot ဖြစ်နေတာ", "Hot right now")} to="/shop" />
      <div className="grid grid-cols-2 gap-3 px-4">
        {isLoading
          ? [0, 1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)
          : hot.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
      </div>

      {/* ── Install banner ── */}
      {!hideInstall && (
        <div className="mx-4 mt-6 flex items-center gap-3 rounded-[22px] bg-candy-butter p-3 pl-4">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-candy-pink text-white">
            <Sparkle className="h-5 w-5" />
          </span>
          <Link to="/me#install" className="min-w-0 flex-1">
            <span className="font-mm block text-sm font-bold">{t("Sinar App ကို ဖုန်းထဲ ထည့်မယ်", "Add Sinar to your phone")}</span>
            <span className="font-mm block text-xs text-[#5C3B00]">{t("Home Screen ကနေ တန်းဖွင့်လို့ရမယ်", "Open it from your home screen")}</span>
          </Link>
          <button onClick={dismissInstall} aria-label={t("ပိတ်မယ်", "Dismiss")} className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-[#7A4A00]">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── New in ── */}
      <SectionTitle icon={<Sparkle className="h-5 w-5 text-candy-sun" />} title={t("အသစ်ရောက်", "New in")} to="/shop?sort=newest" />
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
        {isLoading
          ? [0, 1, 2].map((i) => <div key={i} className="skeleton aspect-[3/4] w-[136px] flex-shrink-0 rounded-[20px]" />)
          : newest.map((p) => <MiniCard key={p.id} p={p} />)}
      </div>

      {/* ── Reviews ── */}
      <SectionTitle icon={<Heart className="h-5 w-5 text-candy-pink" fill="currentColor" />} title={t("ဝယ်သူတွေ ပြောတာ", "Happy customers")} />
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
        {REVIEWS.map((r) => (
          <figure key={r.id} className="flex w-[264px] flex-shrink-0 flex-col gap-3 rounded-[24px] bg-white p-4 shadow-soft">
            <div className="flex gap-0.5 text-candy-pink" aria-label="5 stars">
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4" fill="currentColor" />)}
            </div>
            <blockquote className="font-mm flex-1 text-[13px] leading-relaxed">{t(r.textMm, r.textEn)}</blockquote>
            <figcaption className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold" style={{ background: r.color }}>
                {r.initials}
              </span>
              <span className="flex flex-col">
                <span className="font-mm text-[13px] font-bold">{r.name}</span>
                <span className="text-[11px] text-candy-muted">{r.location}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="font-mm px-5 pb-4 pt-8 text-center text-xs text-candy-muted">
        © {new Date().getFullYear()} Sinar · ချစ်စရာ ဝတ်စုံလေးများ
      </p>
    </div>
  )
}
