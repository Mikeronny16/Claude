import { motion } from "framer-motion"
import { Eye, MessageCircle } from "lucide-react"
import { FALLBACK_IMG } from "@/lib/products"
import { messengerUrl } from "@/config"
import type { Product } from "@/lib/supabase"

interface Props {
  p: Product | (typeof import("@/lib/products").FALLBACK_PRODUCTS)[number]
  index: number
  onQuickView: (p: Product) => void
}

export default function ProductCard({ p, index, onQuickView }: Props) {
  const dmUrl = messengerUrl(p.name_en)

  return (
    <motion.article
      className="group relative bg-forest-light rounded-2xl overflow-hidden border border-hairline hover:border-pink/40 transition-all duration-500 flex flex-col"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-forest">
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

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Sold out overlay */}
        {p.sold_out && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-pink text-white text-xs font-bold px-5 py-2 rounded-full uppercase tracking-[0.25em]">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold backdrop-blur-md uppercase tracking-wider ${
            p.sold_out ? "bg-pink/20 border border-pink/40 text-pink" :
            p.status === "In Stock" ? "bg-emerald-dim border border-emerald/20 text-emerald" :
            "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400"
          }`}>
            <span className="w-1 h-1 rounded-full bg-current" />
            {p.sold_out ? "Sold Out" : p.status}
          </span>
        </div>

        {/* Sizes in top right */}
        <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end max-w-[80px]">
          {p.sizes.slice(0, 3).map((s) => (
            <span key={s} className="bg-black/50 backdrop-blur text-cream/90 text-[9px] font-bold w-6 h-6 rounded-full flex items-center justify-center border border-cream/20">
              {s}
            </span>
          ))}
        </div>

        {/* Slide-up action buttons */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out flex flex-col gap-2">
          {!p.sold_out && (
            <a
              href={dmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-pink text-white py-2.5 rounded-xl text-xs font-semibold hover:shadow-pink transition-shadow"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="font-mm">မှာရန်</span>
            </a>
          )}
          <button
            onClick={() => onQuickView(p as Product)}
            className="flex items-center justify-center gap-2 w-full bg-black/50 backdrop-blur border border-cream/20 text-cream py-2.5 rounded-xl text-xs font-medium hover:border-pink transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="font-mm">အသေးစိတ်ကြည့်ရန်</span>
          </button>
        </div>
      </div>

      {/* Card info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-mm font-semibold text-cream text-sm sm:text-base leading-snug">
          {p.name_mm}
        </h3>
        <p className="text-[11px] text-muted mt-0.5">{p.name_en}</p>

        <div className="flex items-center justify-between mt-3">
          {p.price > 0 ? (
            <p className="font-mm font-bold text-pink text-sm sm:text-base">
              {p.price.toLocaleString()} ကျပ်
            </p>
          ) : (
            <p className="font-mm text-muted text-xs">ဈေးနှုန်းမေးရန်</p>
          )}

          <button
            onClick={() => onQuickView(p as Product)}
            className="p-2 rounded-full bg-forest hover:bg-pink/10 border border-hairline hover:border-pink/40 text-muted hover:text-pink transition-all duration-200"
            aria-label="Quick view"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
