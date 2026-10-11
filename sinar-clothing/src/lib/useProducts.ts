import { useQuery } from "@tanstack/react-query"
import { supabase, isConfigured, type Product } from "@/lib/supabase"
import { FALLBACK_PRODUCTS } from "@/lib/products"

const FALLBACK = FALLBACK_PRODUCTS as unknown as Product[]

/** All shop products. Falls back to sample items when Supabase is empty or not set up. */
export function useProducts() {
  const query = useQuery({
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

  const products = query.data && query.data.length > 0 ? query.data : FALLBACK
  return { products, isLoading: isConfigured && query.isLoading }
}

export function discountPct(p: Product) {
  if (!p.original_price || p.original_price <= p.price) return 0
  return Math.round((1 - p.price / p.original_price) * 100)
}

/** Stable fake "people viewing" number per product (kept from the old Quick View). */
export function viewersFor(id: string) {
  const n = String(id).split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  return (n % 10) + 4
}
