import { toast } from "sonner"
import type { Product } from "@/lib/supabase"

export function formatKs(n: number) {
  return `${n.toLocaleString()} ကျပ်`
}

export type OrderLine = { product: Product; size?: string; color?: string; qty: number }

/** The message customers paste into Messenger / Viber, or that WhatsApp pre-fills. */
export function orderMessage(lines: OrderLine[]) {
  const body = lines.map((l, i) => {
    const details = [
      l.size ? `Size: ${l.size}` : "Size: ?",
      l.color ? `Color: ${l.color}` : null,
      `x${l.qty}`,
    ].filter(Boolean).join(" · ")
    const price = l.product.price > 0 ? formatKs(l.product.price * l.qty) : "ဈေးမေးရန်"
    return `${i + 1}. ${l.product.name_mm} (${l.product.name_en})\n   ${details} — ${price}`
  })
  const total = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0)
  return [
    "မင်္ဂလာပါ Sinar 🛍️",
    "ဒီပစ္စည်းတွေ မှာချင်ပါတယ် —",
    "",
    ...body,
    "",
    total > 0 ? `စုစုပေါင်း — ${formatKs(total)}` : null,
  ].filter((x) => x !== null).join("\n")
}

/** Copy the order so the customer can paste it after the chat app opens. */
export function copyOrder(text: string, lang: "mm" | "en") {
  navigator.clipboard?.writeText(text).then(
    () => toast.success(lang === "mm" ? "Order ကူးပြီးပြီ — Chat ထဲမှာ Paste လုပ်ပါ" : "Order copied — paste it in the chat"),
    () => {}
  )
}
