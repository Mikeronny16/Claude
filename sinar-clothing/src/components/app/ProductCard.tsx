import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Heart, Plus } from "lucide-react"
import { toast } from "sonner"
import type { Product } from "@/lib/supabase"
import { FALLBACK_IMG } from "@/lib/products"
import { discountPct } from "@/lib/useProducts"
import { addToBag, toggleWish, useWishlist } from "@/lib/store"
import { formatKs } from "@/lib/order"
import { useLang } from "@/lib/lang"
import { useAppUI } from "./AppShell"

const BADGES = {
  new: { label: "NEW", cls: "bg-candy-mint text-[#14532D]" },
  hot: { label: "HOT", cls: "bg-candy-pink text-white" },
  sale: { label: "SALE", cls: "bg-candy-sun text-candy-ink" },
  low: { label: "ALMOST GONE", cls: "bg-[#FFE3C2] text-[#9A3412]" },
}

export function Sticker({ p, className = "" }: { p: Product; className?: string }) {
  if (p.sold_out) return null
  const pct = discountPct(p)
  const badge = pct > 0 ? { label: `-${pct}%`, cls: "bg-candy-sun text-candy-ink" } : p.badge ? BADGES[p.badge] : null
  if (!badge) return null
  return (
    <span className={`rounded-full px-2 py-1 text-[11px] font-extrabold leading-none tracking-wide ${badge.cls} ${className}`}>
      {badge.label}
    </span>
  )
}

export function HeartButton({ id, className = "", large = false }: { id: string; className?: string; large?: boolean }) {
  const saved = useWishlist().includes(id)
  const { t } = useLang()
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        const on = toggleWish(id)
        if (on) toast.success(t("Saved ထဲ ထည့်ပြီးပြီ", "Saved"))
      }}
      aria-label={saved ? t("Saved ထဲက ဖယ်မယ်", "Remove from saved") : t("Saved ထဲ ထည့်မယ်", "Save")}
      aria-pressed={saved}
      className={`flex h-11 w-11 items-center justify-center ${className}`}
    >
      <motion.span
        key={String(saved)}
        initial={{ scale: saved ? 0.6 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        className={`flex items-center justify-center rounded-full bg-white/95 text-candy-pink shadow-soft ${large ? "h-11 w-11" : "h-8 w-8"}`}
      >
        <Heart className={large ? "h-5 w-5" : "h-4 w-4"} strokeWidth={2.4} fill={saved ? "currentColor" : "none"} />
      </motion.span>
    </button>
  )
}

export function quickAdd(p: Product, lang: "mm" | "en", openBag: () => void) {
  const sizes = p.sizes ?? []
  addToBag(String(p.id), sizes.length === 1 ? sizes[0] : undefined)
  toast.success(lang === "mm" ? "Bag ထဲ ထည့်ပြီးပြီ" : "Added to bag", {
    action: { label: lang === "mm" ? "ကြည့်မယ်" : "View", onClick: openBag },
  })
}

export default function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const { t, lang } = useLang()
  const { openBag } = useAppUI()
  const id = String(p.id)
  const pct = discountPct(p)

  return (
    <motion.article
      className="relative flex flex-col gap-1.5 rounded-[22px] bg-white p-2 shadow-soft"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/p/${id}`} className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-candy-soft active:opacity-90">
        <img
          src={p.image_url || FALLBACK_IMG}
          alt={p.name_en}
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget
            if (!el.dataset.fb) { el.dataset.fb = "1"; el.src = FALLBACK_IMG }
          }}
          className="h-full w-full object-cover"
        />
        <Sticker p={p} className="absolute left-2 top-2 -rotate-6" />
        {p.sold_out && (
          <span className="absolute inset-0 flex items-center justify-center bg-candy-ink/45">
            <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold tracking-widest text-candy-ink">
              SOLD OUT
            </span>
          </span>
        )}
      </Link>
      <HeartButton id={id} className="absolute right-1.5 top-1.5" />

      <div className="flex flex-col px-1">
        <Link to={`/p/${id}`} className="font-mm truncate text-[13px] font-medium leading-relaxed">
          {p.name_mm}
        </Link>
        <div className="flex items-center justify-between gap-1">
          <span className="flex min-w-0 flex-col">
            <span className="font-mm text-[15px] font-extrabold text-candy-pink">
              {p.price > 0 ? formatKs(p.price) : t("ဈေးမေးရန်", "Ask price")}
            </span>
            <span className="min-h-[16px] text-[11px] text-candy-muted line-through">
              {pct > 0 && p.original_price!.toLocaleString()}
            </span>
          </span>
          {!p.sold_out && (
            <button
              onClick={() => quickAdd(p, lang, openBag)}
              aria-label={t("Bag ထဲ ထည့်မယ်", "Add to bag")}
              className="-mr-1.5 flex h-11 w-11 flex-shrink-0 items-center justify-center"
            >
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-xl bg-candy-pink text-white transition-transform active:scale-90">
                <Plus className="h-[18px] w-[18px]" strokeWidth={2.8} />
              </span>
            </button>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-[22px] bg-white p-2 shadow-soft">
      <div className="skeleton aspect-[3/4] rounded-2xl" />
      <div className="skeleton mx-1 h-4 w-3/4 rounded-full" />
      <div className="skeleton mx-1 mb-1 h-4 w-1/2 rounded-full" />
    </div>
  )
}
