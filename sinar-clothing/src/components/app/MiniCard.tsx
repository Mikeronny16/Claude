import { Link } from "react-router-dom"
import type { Product } from "@/lib/supabase"
import { FALLBACK_IMG } from "@/lib/products"
import { formatKs } from "@/lib/order"
import { useLang } from "@/lib/lang"
import { Sticker } from "./ProductCard"

/** Small product tile for sideways-scrolling rows. */
export default function MiniCard({ p }: { p: Product }) {
  const { t } = useLang()
  return (
    <Link to={`/p/${p.id}`} className="flex w-[136px] flex-shrink-0 flex-col gap-1.5 active:opacity-90">
      <span className="relative block aspect-[3/4] overflow-hidden rounded-[20px] bg-candy-soft shadow-soft">
        <img src={p.image_url || FALLBACK_IMG} alt={p.name_en} loading="lazy" className="h-full w-full object-cover" />
        <Sticker p={p} className="absolute left-2 top-2 -rotate-6" />
      </span>
      <span className="font-mm truncate px-0.5 text-xs font-medium leading-relaxed">{p.name_mm}</span>
      <span className="font-mm -mt-1 px-0.5 text-[13px] font-extrabold text-candy-pink">
        {p.price > 0 ? formatKs(p.price) : t("ဈေးမေးရန်", "Ask price")}
      </span>
    </Link>
  )
}
