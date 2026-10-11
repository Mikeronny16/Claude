import { useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Clock, MessageCircle, Phone, Share2, ShoppingBag, Zap } from "lucide-react"
import { toast } from "sonner"
import type { Product } from "@/lib/supabase"
import { useLang } from "@/lib/lang"
import { FALLBACK_IMG } from "@/lib/products"
import { discountPct, useProducts, viewersFor } from "@/lib/useProducts"
import { addToBag, useBag } from "@/lib/store"
import { copyOrder, formatKs, orderMessage } from "@/lib/order"
import { useMidnightCountdown } from "@/lib/useCountdown"
import { ORDER_STEPS } from "@/lib/content"
import { MESSENGER_URL, VIBER_URL, whatsappUrl } from "@/config"
import { useAppUI } from "@/components/app/AppShell"
import { HeartButton } from "@/components/app/ProductCard"
import { Garment, Sparkle } from "@/components/app/Garment"
import MiniCard from "@/components/app/MiniCard"

// 12-point starburst for the discount sticker
const STAR = "32,1 38.5,7.9 47.5,5.2 49.7,14.3 58.8,16.5 56.1,25.5 63,32 56.1,38.5 58.8,47.5 49.7,49.7 47.5,58.8 38.5,56.1 32,63 25.5,56.1 16.5,58.8 14.3,49.7 5.2,47.5 7.9,38.5 1,32 7.9,25.5 5.2,16.5 14.3,14.3 16.5,5.2 25.5,7.9"

function FlashStrip() {
  const { h, m, s } = useMidnightCountdown()
  const { t } = useLang()
  return (
    <div className="flex h-[46px] items-center justify-between bg-candy-ink px-5 text-white">
      <span className="flex items-center gap-1.5 text-xs font-extrabold tracking-wider text-candy-sun">
        <Zap className="h-4 w-4" fill="currentColor" /> FLASH SALE
      </span>
      <span className="font-mm flex items-center gap-1.5 text-[13px] font-bold tabular-nums">
        <Clock className="h-4 w-4" />
        {t("ကျန်ချိန်", "Ends in")} {h}:{m}:{s}
      </span>
    </div>
  )
}

function ProductView({ p, related }: { p: Product; related: Product[] }) {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const { openBag, openSizeGuide } = useAppUI()
  const bag = useBag()
  const sizes = p.sizes ?? []
  const colors = p.colors ?? []
  const [size, setSize] = useState<string | undefined>(sizes.length === 1 ? sizes[0] : undefined)
  const [color, setColor] = useState<string | undefined>(colors.length === 1 ? colors[0].name : undefined)
  const [nudge, setNudge] = useState(0)
  const sizeRef = useRef<HTMLDivElement>(null)

  const id = String(p.id)
  const pct = discountPct(p)
  const bagCount = bag.reduce((n, i) => n + i.qty, 0)
  const message = orderMessage([{ product: p, size, color, qty: 1 }])
  const needsSize = !p.sold_out && sizes.length > 1 && !size

  function goBack() {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1)
    else navigate("/")
  }

  async function share() {
    const url = window.location.href
    const text = `Sinar — ${p.name_mm}\n${p.price > 0 ? formatKs(p.price) : ""}`
    if (navigator.share) {
      try { await navigator.share({ title: `Sinar — ${p.name_mm}`, text, url }) } catch {}
    } else {
      await navigator.clipboard?.writeText(`${text}\n${url}`)
      toast.success(t("Link ကူးပြီးပြီ", "Link copied"))
    }
  }

  function askForSize() {
    setNudge((n) => n + 1)
    sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    toast(t("Size အရင် ရွေးပေးပါ", "Pick a size first"))
  }

  function addThis() {
    if (needsSize) return askForSize()
    addToBag(id, size, color)
    toast.success(t("Bag ထဲ ထည့်ပြီးပြီ", "Added to bag"), { action: { label: t("ကြည့်မယ်", "View"), onClick: openBag } })
  }

  return (
    <div className="pb-32">
      {/* ── Photo ── */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(80%_70%_at_50%_42%,#FFF8DE_0%,#FFE8EF_68%,#FFD9E6_100%)]">
        <motion.img
          src={p.image_url || FALLBACK_IMG}
          alt={p.name_en}
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
          className="h-full w-full object-cover"
        />
        {p.sold_out && (
          <span className="absolute inset-0 flex items-center justify-center bg-candy-ink/45">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-extrabold tracking-widest">SOLD OUT</span>
          </span>
        )}

        <div className="pt-safe absolute inset-x-0 top-0 flex justify-between px-3.5 pt-3.5">
          <button onClick={goBack} aria-label={t("နောက်သို့", "Back")} className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft active:scale-95">
            <ArrowLeft className="h-5 w-5" strokeWidth={2.4} />
          </button>
          <div className="flex gap-2">
            <button onClick={share} aria-label={t("Share မယ်", "Share")} className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-soft active:scale-95">
              <Share2 className="h-[18px] w-[18px]" strokeWidth={2.4} />
            </button>
            <HeartButton id={id} large />
          </div>
        </div>

        {pct > 0 && !p.sold_out && (
          <div className="absolute bottom-5 right-5 h-[82px] w-[82px] animate-wobble">
            <svg viewBox="0 0 64 64" className="absolute inset-0 drop-shadow-[0_6px_10px_rgba(120,60,0,0.25)]" aria-hidden="true">
              <polygon points={STAR} className="fill-candy-sun" />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center font-display leading-none">
              <span className="text-xl font-bold">-{pct}%</span>
              <span className="mt-0.5 text-[10px] font-semibold">{t("ယနေ့", "today")}</span>
            </span>
          </div>
        )}
        <Sparkle className="absolute bottom-8 left-6 h-5 w-5 animate-twinkle text-white drop-shadow" />
      </div>

      {pct > 0 && !p.sold_out && <FlashStrip />}

      <div className="flex flex-col gap-5 px-5 pt-5">
        {/* Price + name */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[30px] font-bold leading-tight text-candy-pink">
              {p.price > 0 ? formatKs(p.price) : t("ဈေးမေးရန်", "Ask for price")}
            </span>
            {pct > 0 && (
              <>
                <span className="text-sm text-candy-muted line-through">{p.original_price!.toLocaleString()}</span>
                <span className="font-mm rounded-full bg-candy-sun px-2.5 py-0.5 text-xs font-bold">
                  {t(`${formatKs(p.original_price! - p.price)} သက်သာ`, `Save ${formatKs(p.original_price! - p.price)}`)}
                </span>
              </>
            )}
          </div>
          <h1 className="font-mm text-lg font-semibold leading-relaxed">{p.name_mm}</h1>
          <p className="-mt-1 text-[13px] text-candy-muted">{p.name_en}</p>
        </div>

        {/* Live chips */}
        <div className="flex flex-wrap gap-2">
          {!p.sold_out && (
            <span className="font-mm flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-soft">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#16A34A]" />
              {t(`${viewersFor(id)} ယောက် ကြည့်နေတယ်`, `${viewersFor(id)} people viewing`)}
            </span>
          )}
          {p.sold_out ? (
            <span className="font-mm rounded-full bg-candy-soft px-3 py-1.5 text-xs font-bold text-candy-pink-dark">{t("ကုန်သွားပြီ", "Sold out")}</span>
          ) : p.status === "Low Stock" || p.badge === "low" ? (
            <span className="font-mm flex items-center gap-1 rounded-full bg-candy-butter px-3 py-1.5 text-xs font-bold text-[#7A4A00]">
              <Zap className="h-3.5 w-3.5" fill="currentColor" /> {t("နည်းနည်းပဲ ကျန်တော့တယ်", "Almost gone")}
            </span>
          ) : (
            <span className="font-mm flex items-center gap-1 rounded-full bg-candy-mint px-3 py-1.5 text-xs font-bold text-[#14532D]">
              <Check className="h-3.5 w-3.5" strokeWidth={3} /> {t("ရနိုင်ပါတယ်", "In stock")}
            </span>
          )}
        </div>

        {/* Colours */}
        {colors.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <p className="font-display text-base font-semibold">
              {t("အရောင်", "Colour")} <span className="font-mm font-medium text-candy-muted">· {color ?? t("ရွေးပါ", "pick one")}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.hex + c.name}
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-[2.5px] bg-white ${color === c.name ? "border-candy-pink" : "border-candy-line"}`}
                >
                  <span className="h-9 w-9 rounded-full border border-candy-ink/10" style={{ background: c.hex }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <div ref={sizeRef} className="flex flex-col gap-2.5">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-base font-semibold">{t("Size ရွေးပါ", "Pick your size")}</p>
              <button onClick={openSizeGuide} className="font-mm -mr-2 h-10 px-2 text-[13px] font-extrabold text-candy-pink">
                {t("Size ဇယား", "Size guide")}
              </button>
            </div>
            <motion.div
              key={nudge}
              animate={nudge ? { x: [0, -8, 8, -5, 5, 0] } : undefined}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`h-12 min-w-[62px] rounded-full border-2 px-4 text-sm font-extrabold transition-colors ${
                    size === s ? "border-candy-pink bg-candy-pink text-white" : nudge ? "border-candy-pink bg-white" : "border-candy-line bg-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </motion.div>
          </div>
        )}

        {/* Other apps */}
        {!p.sold_out && (
          <div className="flex flex-col gap-2.5 rounded-[22px] bg-white p-4 shadow-soft">
            <p className="font-mm text-sm font-bold">{t("တခြား App နဲ့ မှာမယ်", "Order on another app")}</p>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={VIBER_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => copyOrder(message, lang)}
                className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-candy-line text-sm font-bold active:bg-candy-soft"
              >
                <Phone className="h-4 w-4" /> Viber
              </a>
              <a
                href={whatsappUrl(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-candy-line text-sm font-bold active:bg-candy-soft"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* How to order */}
        <div className="flex flex-col gap-3 rounded-[22px] bg-candy-lilac/70 p-4">
          <p className="font-display text-base font-semibold">{t("မှာနည်း", "How to order")}</p>
          <ol className="flex flex-col gap-2.5">
            {ORDER_STEPS.map((s, i) => (
              <li key={s.en} className="flex items-start gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-xs font-extrabold text-[#4B2BB8]">
                  {i + 1}
                </span>
                <span className="font-mm text-[13px] leading-relaxed text-[#3A2A55]">{t(s.descMm, s.descEn)}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="-mx-5 flex flex-col gap-3">
            <p className="font-display px-5 text-[19px] font-semibold">{t("ဒါလေးတွေလည်း ကြိုက်မယ်", "You may also like")}</p>
            <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
              {related.map((r) => <MiniCard key={r.id} p={r} />)}
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky order bar ── */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-lg gap-2.5 rounded-t-[26px] bg-white px-4 pt-3 shadow-bar">
        {!p.sold_out && (
          <button
            onClick={addThis}
            aria-label={t("Bag ထဲ ထည့်မယ်", "Add to bag")}
            className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-candy-line active:scale-95"
          >
            <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={2.2} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-candy-sun px-1 text-[11px] font-extrabold">
              {bagCount > 0 ? bagCount : "+"}
            </span>
          </button>
        )}
        <a
          href={MESSENGER_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (needsSize) {
              e.preventDefault()
              askForSize()
              return
            }
            copyOrder(message, lang)
          }}
          className="font-mm flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-candy-pink text-[15px] font-bold text-white shadow-cta active:scale-[0.98]"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={2.3} />
          {p.sold_out
            ? t("ပြန်ရောက်ရင် ပြောပါ", "Ask about restock")
            : `${t("Messenger နဲ့ မှာမယ်", "Order on Messenger")}${size ? ` · ${size}` : ""}`}
        </a>
      </div>
    </div>
  )
}

export default function ProductPage() {
  const { id } = useParams()
  const { products, isLoading } = useProducts()
  const { t } = useLang()
  const p = products.find((x) => String(x.id) === id)

  if (!p) {
    return isLoading ? (
      <div>
        <div className="skeleton aspect-[4/5]" />
        <div className="flex flex-col gap-3 p-5">
          <div className="skeleton h-8 w-1/2 rounded-full" />
          <div className="skeleton h-5 w-3/4 rounded-full" />
          <div className="skeleton h-12 w-full rounded-full" />
        </div>
      </div>
    ) : (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-8 text-center">
        <span className="flex h-28 w-28 items-center justify-center rounded-[36px] bg-candy-soft">
          <Garment kind="top" className="h-20 w-16" />
        </span>
        <p className="font-mm text-base font-semibold">{t("ဒီပစ္စည်း မရှိတော့ဘူး", "This item isn't available anymore")}</p>
        <Link to="/shop" className="font-mm flex h-12 items-center rounded-full bg-candy-pink px-6 text-sm font-bold text-white">
          {t("တခြားဟာတွေ ကြည့်မယ်", "See other pieces")}
        </Link>
      </div>
    )
  }

  const related = products.filter((x) => x.category === p.category && x.id !== p.id && !x.sold_out).slice(0, 6)
  return <ProductView key={p.id} p={p} related={related} />
}
