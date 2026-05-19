import { Circle, MessageCircle } from "lucide-react"
import { FALLBACK_IMG } from "@/lib/products"
import { messengerUrl } from "@/config"
import type { Product } from "@/lib/supabase"

export default function ProductCard({ p, index }: { p: Product | (typeof import("@/lib/products").FALLBACK_PRODUCTS)[number]; index: number }) {
  const dmUrl = messengerUrl(p.name_en)

  return (
    <article
      className="reveal group bg-white rounded-2xl overflow-hidden border border-hairline hover:shadow-soft transition-all duration-300 hover:-translate-y-1 flex flex-col"
      style={{ transitionDelay: `${(index % 8) * 60}ms` }}
    >
      {/* Image */}
      <a href={dmUrl} target="_blank" rel="noopener noreferrer" className="relative block aspect-[3/4] bg-cream overflow-hidden">
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

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md ${
            p.status === "In Stock" ? "bg-sage/90 text-white" : "bg-amber-400/95 text-amber-950"
          }`}>
            <Circle className={`w-1.5 h-1.5 fill-current`} />
            {p.status}
          </span>
        </div>

        {/* Sizes */}
        <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end max-w-[80px]">
          {p.sizes.map((s) => (
            <span key={s} className="bg-white/90 backdrop-blur text-ink text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border border-hairline">
              {s}
            </span>
          ))}
        </div>

        {/* Hover DM overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-xs text-center font-mm">DM ပို့ပြီး မှာယူပါ</p>
        </div>
      </a>

      {/* Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="font-mm font-semibold text-ink text-sm sm:text-base leading-snug">{p.name_mm}</h3>
        <p className="text-xs text-muted mt-0.5">{p.name_en}</p>

        {p.price > 0 && (
          <p className="font-mm font-bold text-deep mt-2 text-sm sm:text-base">
            {p.price.toLocaleString()} ကျပ်
          </p>
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
