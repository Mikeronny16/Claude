import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { supabase, isConfigured, type Product } from "@/lib/supabase"
import { FALLBACK_PRODUCTS, type Category } from "@/lib/products"
import ProductCard from "./ProductCard"
import QuickViewModal from "./QuickViewModal"
import OrderInstructions from "./OrderInstructions"
import { HelpCircle } from "lucide-react"

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
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)

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

  return (
    <section id="shop" className="py-20 lg:py-32 bg-forest">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            className="text-[10px] tracking-[0.5em] text-pink uppercase mb-4 font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Collection
          </motion.div>

          <motion.h2
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            ကျွန်မတို့ရဲ့{" "}
            <span className="italic text-gradient-pink">ဝတ်စုံလေးများ</span>
          </motion.h2>

          <motion.p
            className="font-mm text-muted mt-4 max-w-md mx-auto text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ရွေးချယ်ထားသော ချစ်စရာ ဝတ်စုံလေးများ
          </motion.p>

          {/* How to order button */}
          <motion.button
            onClick={() => setShowInstructions(true)}
            className="mt-5 inline-flex items-center gap-2 text-xs text-muted hover:text-pink transition-colors border border-hairline hover:border-pink/40 px-4 py-2 rounded-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="font-mm">မှာယူနည်း သိချင်ရင်</span>
          </motion.button>
        </div>

        {/* Filter tabs */}
        <motion.div
          className="mb-10 flex justify-start sm:justify-center overflow-x-auto no-scrollbar -mx-5 px-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-flex gap-2 bg-forest-mid border border-hairline rounded-full p-1.5">
            {FILTERS.map((f) => {
              const active = filter === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`relative whitespace-nowrap px-4 sm:px-5 py-2 rounded-full text-sm transition-all duration-300 ${
                    active ? "text-white" : "text-muted hover:text-cream"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 bg-pink rounded-full"
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    />
                  )}
                  <span className="relative z-10 font-mm font-medium">{f.mm}</span>
                  <span className="relative z-10 ml-1.5 text-[10px] opacity-60">{f.en}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {items.map((p, i) => (
            <ProductCard
              key={p.id}
              p={p}
              index={i}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-24 text-muted font-mm text-sm">
            ဤ category တွင် ပစ္စည်းမရှိသေးပါ
          </div>
        )}
      </div>

      {/* Modals */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <OrderInstructions open={showInstructions} onClose={() => setShowInstructions(false)} />
    </section>
  )
}
