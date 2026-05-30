import { MessageCircle, Eye } from "lucide-react"
import { FALLBACK_IMG } from "@/lib/products"
import { messengerUrl } from "@/config"
import type { Product } from "@/lib/supabase"

const BADGE_CONFIG = {
  new:  { label: "✨ New",         bg: "bg-emerald-500",  text: "text-white" },
  hot:  { label: "🔥 Hot Item",   bg: "bg-pink-500",     text: "text-white" },
  sale: { label: "💸 Sale",        bg: "bg-amber-500",    text: "text-white" },
  low:  { label: "⚡ Almost Gone", bg: "bg-orange-500",   text: "text-white" },
}

function pseudoViewers(id: string): number {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  return (n % 10) + 4
}

interface Props {
  p: Product | (typeof import("@/lib/products").FALLBACK_PRODUCTS)[number]
  index: number
  onQuickView?: (p: Product) => void
}

export default function ProductCard({ p, index, onQuickView }: Props) {
  const dmUrl = messengerUrl(p.name_en)
  const badge = (p as Product).badge
  const originalPrice = (p as Product).original_price
  const hasDiscount = originalPrice && originalPrice > p.price
  const discountPct = hasDiscount ? Math.round((1 - p.price / originalPrice!) * 100) : 0
  const viewers = pseudoViewers(String(p.id))

  return (
    <article
      className="reveal group bg-white rounded-2xl overflow-hidden border border-hairline hover:shadow-soft transition-all duration-300 hover:-translate-y-1 flex flex-col"
      style={{ transitionDelay: `${(index % 8) * 60}ms` }}
    >
      {/* Image */}
      <div className="relative block aspect-[3/4] bg-cream overflow-hidden">
        <img
          src={p.image_url || FALLBACK_IMG}
          alt={p.name_en}
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget
            if (!el.dataset.fb) { el.dataset.fb = "1"; el.src = FALLBACK_IMG }
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Sold out overlay */}
        {p.sold_out && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-ink text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}

        {/* FOMO badge top-left */}
        {badge && BADGE_CONFIG[badge] && !p.sold_out && (
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${BADGE_CONFIG[badge].bg} ${BADGE_CONFIG[badge].text}`}>
              {BADGE_CONFIG[badge].label}
            </span>
          </div>
        )}

        {/* Discount pill top-right */}
        {hasDiscount && !p.sold_out && (
          <div className="absolute top-3 right-3">
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discountPct}%
            </span>
          </div>
        )}

        {/* Sizes — only show when no discount pill */}
        {!hasDiscount && (
          <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end max-w-[80px]">
            {p.sizes.map((s) => (
              <span key={s} className="bg-white/90 backdrop-blur text-ink text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border border-hairline">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Viewer count */}
        {!p.sold_out && (
          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <span className="hidden group-hover:flex items-center gap-1 bg-black/60 backdrop-blur-sm text-emerald-400 text-[10px] font-medium px-2.5 py-1 rounded-full">
              <Eye className="w-2.5 h-2.5" />
              {viewers} viewing now
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(p as Product)}
              className="flex-1 bg-white/95 text-ink text-[11px] font-semibold py-2 rounded-lg hover:bg-white transition-colors"
            >
              Quick View
            </button>
          )}
          <a
            href={dmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-pink-500 text-white text-[11px] font-semibold py-2 rounded-lg text-center hover:bg-pink-600 transition-colors"
          >
            <span className="font-mm">DM မှာရန်</span>
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="font-mm font-semibold text-ink text-sm sm:text-base leading-snug">{p.name_mm}</h3>
        <p className="text-xs text-muted mt-0.5">{p.name_en}</p>

        {p.price > 0 && (
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-mm font-bold text-deep text-sm sm:text-base">
              {p.price.toLocaleString()} ကျပ်
            </p>
            {hasDiscount && (
              <p className="font-mm text-xs text-muted line-through">
                {originalPrice!.toLocaleString()}
              </p>
            )}
          </div>
        )}

        <a
          href={dmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-3 inline-flex items-center justify-center gap-2 bg-cream hover:bg-deep hover:text-white text-ink border border-hairline px-4 py-2 rounded-full text-xs font-medium transition-all duration-200"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="font-mm">DM ပို့ရန်</span>
        </a>
      </div>
    </article>
  )
}
