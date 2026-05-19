import { useMemo, useState } from "react";
import { Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCTS, FALLBACK_IMG, type Category } from "@/lib/sinar-products";
import { messengerWith } from "@/lib/sinar-links";

type Filter = "All" | Category;

const FILTERS: { key: Filter; mm: string; en: string }[] = [
  { key: "All",       mm: "အားလုံး",   en: "All" },
  { key: "Tops",      mm: "အပေါ်ထပ်",  en: "Tops" },
  { key: "Cardigans", mm: "Cardigan", en: "Cardigans" },
  { key: "Dresses",   mm: "ဂါဝန်",    en: "Dresses" },
  { key: "Jeans",     mm: "ဂျင်း",    en: "Jeans" },
  { key: "Sweaters",  mm: "ဆွယ်တာ",   en: "Sweaters" },
];

export function Products() {
  const [filter, setFilter] = useState<Filter>("All");

  const { data: live } = useQuery({
    queryKey: ["public-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name_en,name_mm,category,sizes,status,image_url,sold_out,sort_order")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  type Item = (typeof PRODUCTS)[number] & { sold_out?: boolean };
  const all: Item[] = (live && live.length > 0 ? (live as Item[]) : (PRODUCTS as Item[]));
  const items = useMemo(
    () => (filter === "All" ? all : all.filter((p) => p.category === filter)),
    [filter, all]
  );

  return (
    <section id="shop" className="py-16 lg:py-24 gradient-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center reveal">
          <div className="text-xs tracking-[0.3em] text-deep uppercase mb-3">Our Collection</div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink">
            ကျွန်မတို့ရဲ့ <span className="italic text-shimmer">ဝတ်စုံလေးများ</span>
          </h2>
          <p className="font-mm text-muted mt-4 max-w-xl mx-auto">
            ရွေးချယ်ထားသော ချစ်စရာ ဝတ်စုံလေးများ — DM ဖြင့် ဈေးနှုန်းမေးနိုင်ပါသည်
          </p>
        </div>

        <div className="mt-10 flex justify-start sm:justify-center overflow-x-auto no-scrollbar -mx-4 px-4">
          <div className="inline-flex gap-2 bg-white border border-hairline rounded-full p-1.5 shadow-card">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-full text-sm transition-all ${
                    active ? "bg-deep text-white shadow-soft" : "text-ink hover:bg-cream"
                  }`}
                >
                  <span className="font-mm font-medium">{f.mm}</span>
                  <span className="ml-1.5 text-[11px] opacity-70">{f.en}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {items.map((p, i) => (
            <article
              key={p.id}
              className="reveal group bg-white rounded-2xl overflow-hidden border border-hairline hover:shadow-soft transition-all duration-300 hover:-translate-y-1 flex flex-col"
              style={{ transitionDelay: `${(i % 8) * 60}ms` }}
            >
              <a
                href={messengerWith(p.name_en)}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-[3/4] bg-cream overflow-hidden"
              >
                <img
                  src={p.image_url || FALLBACK_IMG}
                  alt={p.name_en}
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.dataset.fb !== "1") {
                      el.dataset.fb = "1";
                      el.src = FALLBACK_IMG;
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {p.sold_out && (
                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                    <span className="bg-white text-ink text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Sold out</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md ${
                      p.status === "In Stock" ? "bg-sage/90 text-white" : "bg-amber-400/95 text-amber-950"
                    }`}
                  >
                    <Circle
                      className={`w-1.5 h-1.5 ${
                        p.status === "In Stock" ? "fill-white text-white" : "fill-amber-950 text-amber-950"
                      }`}
                    />
                    {p.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-1">
                  {p.sizes.map((s) => (
                    <span key={s} className="bg-white/90 backdrop-blur text-ink text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border border-hairline">
                      {s}
                    </span>
                  ))}
                </div>
              </a>
              <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <h3 className="font-mm font-semibold text-ink text-sm sm:text-base leading-snug">{p.name_mm}</h3>
                <p className="text-xs text-muted mt-0.5">{p.name_en}</p>
                {p.price && p.price > 0 && (
                  <p className="font-mm font-bold text-deep mt-2 text-base">
                    {p.price.toLocaleString()} ကျပ်
                  </p>
                )}
                <a
                  href={messengerWith(p.name_en)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 bg-cream hover:bg-deep hover:text-white text-ink border border-hairline px-4 py-2 rounded-full text-xs font-medium transition-colors"
                >
                  <span className="font-mm">DM ပို့ရန်</span>
                  <span className="opacity-70">· DM</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
