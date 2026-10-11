import { useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Search, X } from "lucide-react"
import { useLang } from "@/lib/lang"
import { CATEGORIES } from "@/lib/products"
import { useProducts } from "@/lib/useProducts"
import ProductCard, { ProductCardSkeleton } from "@/components/app/ProductCard"
import { Garment } from "@/components/app/Garment"

const SORTS = [
  { key: "default", mm: "အကြံပြု", en: "Recommended" },
  { key: "newest", mm: "အသစ်ဆုံး", en: "Newest" },
  { key: "price_asc", mm: "ဈေးနည်း → များ", en: "Price: low → high" },
  { key: "price_desc", mm: "ဈေးများ → နည်း", en: "Price: high → low" },
]

export default function Shop() {
  const { t } = useLang()
  const [params, setParams] = useSearchParams()
  const { products, isLoading } = useProducts()

  const q = params.get("q") ?? ""
  const cat = params.get("cat") ?? "All"
  const sort = params.get("sort") ?? "default"

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (!value || value === "All" || value === "default") next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const items = useMemo(() => {
    let list = cat === "All" ? products : products.filter((p) => p.category === cat)
    const query = q.trim().toLowerCase()
    if (query) list = list.filter((p) => p.name_en.toLowerCase().includes(query) || p.name_mm.includes(q.trim()))
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price)
    else if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price)
    else if (sort === "newest") list = [...list].sort((a, b) => (Date.parse(b.created_at ?? "") || 0) - (Date.parse(a.created_at ?? "") || 0))
    return list
  }, [products, cat, q, sort])

  const chips = [{ key: "All", mm: "အားလုံး", en: "All" }, ...CATEGORIES]

  return (
    <div>
      <div className="pt-safe sticky top-0 z-30 bg-candy-bg/95 backdrop-blur-md">
        <div className="flex items-end justify-between px-5 pb-3 pt-4">
          <h1 className="font-display text-[30px] font-bold leading-none">{t("ဆိုင်", "Shop")}</h1>
          <span className="font-mm text-xs font-semibold text-candy-muted">{items.length} {t("ခု", "items")}</span>
        </div>
        <div className="relative px-4 pb-3">
          <label htmlFor="shop-search" className="sr-only">{t("ရှာမယ်", "Search")}</label>
          <Search className="absolute left-8 top-[15px] h-5 w-5 text-candy-muted" strokeWidth={2.2} />
          <input
            id="shop-search"
            type="search"
            value={q}
            onChange={(e) => update("q", e.target.value)}
            placeholder={t("ဝတ်စုံ၊ အကျီ ရှာမယ်…", "Search dresses, tops…")}
            className="font-mm h-[50px] w-full rounded-full border-2 border-candy-line bg-white pl-12 pr-12 text-[15px] outline-none placeholder:text-candy-muted/80 focus:border-candy-pink"
          />
          {q && (
            <button
              onClick={() => update("q", "")}
              aria-label={t("ရှင်းမယ်", "Clear search")}
              className="absolute right-6 top-[3px] flex h-11 w-11 items-center justify-center text-candy-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
          {chips.map((c) => {
            const active = cat === c.key
            return (
              <button
                key={c.key}
                onClick={() => update("cat", c.key)}
                aria-pressed={active}
                className={`font-mm h-10 flex-shrink-0 rounded-full px-4 text-[13px] font-bold transition-colors ${
                  active ? "bg-candy-pink text-white shadow-cta" : "border-2 border-candy-line bg-white"
                }`}
              >
                {t(c.mm, c.en)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-end px-4 pb-3 pt-1">
        <label htmlFor="shop-sort" className="font-mm mr-2 text-xs font-semibold text-candy-muted">{t("စီမယ်", "Sort")}</label>
        <select
          id="shop-sort"
          value={sort}
          onChange={(e) => update("sort", e.target.value)}
          className="font-mm h-10 rounded-full border-2 border-candy-line bg-white px-3 text-[13px] font-bold outline-none"
        >
          {SORTS.map((s) => <option key={s.key} value={s.key}>{t(s.mm, s.en)}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 px-4">
          {[0, 1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 px-4">
          {items.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 px-8 py-14 text-center">
          <span className="flex h-28 w-28 items-center justify-center rounded-[36px] bg-candy-soft">
            <Garment kind="maxi" className="h-20 w-16" />
          </span>
          <p className="font-mm text-base font-semibold">
            {q ? t(`"${q}" နဲ့ ပစ္စည်း မတွေ့ဘူး`, `Nothing found for "${q}"`) : t("ဒီအမျိုးအစားမှာ ပစ္စည်း မရှိသေးဘူး", "Nothing here yet")}
          </p>
          <Link to="/shop" replace className="font-mm flex h-11 items-center rounded-full bg-candy-ink px-5 text-sm font-bold text-white">
            {t("အားလုံး ကြည့်မယ်", "See everything")}
          </Link>
        </div>
      )}
    </div>
  )
}
