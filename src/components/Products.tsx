import { useMemo, useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase, isConfigured, type Product } from "@/lib/supabase"
import { FALLBACK_PRODUCTS, type Category } from "@/lib/products"
import ProductCard from "./ProductCard"
import QuickViewModal from "./QuickViewModal"

type Filter = "All" | Category

const FILTERS: { key: Filter; mm: string; en: string }[] = [
  { key: "All", mm: "အားလုံး", en: "All" },
  { key: "Tops", mm: "အပေါ်ဆောင်း", en: "Tops" },
  { key: "Cardigans", mm: "Cardigan", en: "Cardigans" },
  { key: "Dresses", mm: "ဂါဝန်", en: "Dresses" },
  { key: "Jeans", mm: "ဂျင်း", en: "Jeans" },
  { key: "Sweaters", mm: "ဆွယ်တာ", en: "Sweaters" },
]

export default function Products() {
  const [filter, setFilter] = useState<Filter>("All")
  const [quickView, setQuickView] = useState<Product | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const { data: live } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as Product[]
    },
    enabled: isConfigured,
  })

  const all = live && live.length > 0 ? live : (FALLBACK_PRODUCTS as unknown as Product[])

  const items = useMemo(
    () => filter === "All" ? all : all.filter((p) => p.category === filter),
    [filter, all]
  )

  // Intersection observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    )
    const els = sectionRef.current?.querySelectorAll(".reveal")
    els?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  return (
    <section id="shop" className="py-16 lg:py-24 gradient-soft" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center reveal">
          <div className="text-xs tracking-[0.3em] text-muted uppercase mb-3">Our Collection</div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink">
            ကျွန်မတို့ရဲ့ <span className="italic text-shimmer">ဝတ်စုံလေးများ</span>
          </h2>
          <p className="font-mm text-muted mt-4 max-w-xl mx-auto text-sm sm:text-base">
            ရွေးချယ်ထားသော ချစ်စရာ ဝတ်စုံလေးများ — DM ဖြင့် ဈေးနှုန်းမေးနိုင်ပါသည်
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mt-10 flex justify-start sm:justify-center overflow-x-auto no-scrollbar -mx-4 px-4">
          <div className="inline-flex gap-2 bg-white border border-hairline rounded-full p-1.5 shadow-card">
            {FILTERS.map((f) => {
              const active = filter === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-full text-sm transition-all duration-200 ${
                    active ? "bg-deep text-cream shadow-soft" : "text-ink hover:bg-blush"
                  }`}
                >
                  <span className="font-mm font-medium">{f.mm}</span>
                  <span className="ml-1.5 text-[11px] opacity-60">{f.en}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} onQuickView={setQuickView} />
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20 text-muted font-mm">
            ဤ category တွင် ပစ္စည်းမရှိသေးပါ
          </div>
        )}
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  )
}
