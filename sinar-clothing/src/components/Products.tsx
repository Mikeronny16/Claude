import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { supabase, isConfigured, type Product } from "@/lib/supabase"
import { FALLBACK_PRODUCTS, type Category } from "@/lib/products"
import ProductCard from "./ProductCard"
import QuickViewModal from "./QuickViewModal"
import OrderInstructions from "./OrderInstructions"
import SizeGuide from "./SizeGuide"
import { HelpCircle, Ruler } from "lucide-react"
import { useLang } from "@/lib/lang"
import { useTheme } from "@/lib/theme"

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
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const { t, lang } = useLang()
  const { isDark } = useTheme()

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

  const bgSection = isDark ? "bg-[#0A1A0F]" : "bg-[#FAF7F2]"
  const textMain = isDark ? "text-[#F5F0E8]" : "text-[#1A2E1F]"
  const textMuted = isDark ? "text-[#7A8F7D]" : "text-[#3D5A45]"
  const filterBg = isDark ? "bg-[#0F2415] border-[rgba(255,255,255,0.06)]" : "bg-white border-[rgba(45,90,61,0.10)]"
  const filterBtn = isDark ? "text-[#7A8F7D] hover:text-[#F5F0E8]" : "text-[#3D5A45] hover:text-[#1A2E1F]"

  return (
    <section id="shop" className={`py-24 lg:py-36 ${bgSection} grain-texture`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Editorial header — left-aligned on desktop */}
        <div className="mb-14 lg:flex lg:items-end lg:justify-between lg:gap-8">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-8 h-px bg-pink" />
              <span className="editorial-label text-pink">
                {t("ကျွန်မတို့ရဲ့", "OUR")} COLLECTION
              </span>
            </motion.div>

            <motion.h2
              className={`font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight ${textMain}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {t("ဝတ်စုံ", "The")}{" "}
              <span className="italic text-pink">{t("လှပသော", "Beautiful")}</span>
              <br className="hidden sm:block" />
              {t("ရွေးချယ်မှုများ", "Selection")}
            </motion.h2>

            <motion.p
              className={`font-mm text-sm mt-3 max-w-sm ${textMuted}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t(
                "ရွေးချယ်ထားသော ချစ်စရာ ဝတ်စုံလေးများ",
                "Carefully curated pieces for every occasion"
              )}
            </motion.p>
          </div>

          {/* Right: helper buttons */}
          <motion.div
            className="flex items-center gap-3 mt-6 lg:mt-0 flex-shrink-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
          >
            <button
              onClick={() => setShowSizeGuide(true)}
              className={`inline-flex items-center gap-2 text-xs border px-4 py-2 rounded-full transition-colors hover:border-pink/40 hover:text-pink ${
                isDark
                  ? "border-[rgba(255,255,255,0.10)] text-[#7A8F7D]"
                  : "border-[rgba(45,90,61,0.15)] text-[#3D5A45]"
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span className={lang === "mm" ? "font-mm" : ""}>{t("အရွယ်အစားဇယား", "Size Guide")}</span>
            </button>
            <button
              onClick={() => setShowInstructions(true)}
              className={`inline-flex items-center gap-2 text-xs border px-4 py-2 rounded-full transition-colors hover:border-pink/40 hover:text-pink ${
                isDark
                  ? "border-[rgba(255,255,255,0.10)] text-[#7A8F7D]"
                  : "border-[rgba(45,90,61,0.15)] text-[#3D5A45]"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className={lang === "mm" ? "font-mm" : ""}>{t("မှာနည်း", "How to Order")}</span>
            </button>
          </motion.div>
        </div>

        {/* Filter tabs — horizontal scroll on mobile */}
        <motion.div
          className="mb-10 -mx-5 px-5 overflow-x-auto no-scrollbar"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={`inline-flex gap-1.5 border rounded-full p-1.5 ${filterBg}`}>
            {FILTERS.map((f) => {
              const active = filter === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`relative whitespace-nowrap px-4 sm:px-5 py-2 rounded-full text-xs transition-all duration-300 font-medium ${
                    active ? "text-white" : filterBtn
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 bg-pink rounded-full"
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    />
                  )}
                  <span className={`relative z-10 font-mm`}>{f.mm}</span>
                  <span className="relative z-10 ml-1.5 text-[9px] opacity-60">{f.en}</span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Editorial masonry-ish grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {items.map((p, i) => (
              <ProductCard
                key={p.id}
                p={p}
                index={i}
                onQuickView={setQuickViewProduct}
                large={i === 0}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className={`text-center py-24 text-sm font-mm ${textMuted}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t("ဤ category တွင် ပစ္စည်းမရှိသေးပါ", "No items in this category yet")}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <OrderInstructions open={showInstructions} onClose={() => setShowInstructions(false)} />
      <SizeGuide open={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </section>
  )
}
