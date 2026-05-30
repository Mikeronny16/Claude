import { useState, useEffect } from "react"
import { X, MessageCircle, Phone, Share2, Check, Eye } from "lucide-react"
import { messengerUrl, viberUrl, whatsappUrl, SITE } from "@/config"
import type { Product } from "@/lib/supabase"
import { FALLBACK_IMG } from "@/lib/products"

interface Props {
  product: Product | null
  onClose: () => void
}

function pseudoViewers(id: string): number {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  return (n % 10) + 4
}

export default function QuickViewModal({ product: p, onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (p) {
      document.body.style.overflow = "hidden"
      requestAnimationFrame(() => setVisible(true))
    } else {
      setVisible(false)
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [p])

  if (!p) return null

  const prod = p
  const dmUrl = messengerUrl(prod.name_en)
  const vUrl = viberUrl(prod.name_en)
  const waUrl = whatsappUrl(prod.name_en)
  const viewers = pseudoViewers(String(prod.id))
  const hasDiscount = prod.original_price && prod.original_price > prod.price
  const discountPct = hasDiscount ? Math.round((1 - prod.price / prod.original_price!) * 100) : 0

  async function handleShare() {
    const shareText = `🛍️ Sinar Clothing\n${prod.name_mm} — ${prod.name_en}\n💰 ${prod.price.toLocaleString()} ကျပ်\n\n${SITE.facebookUrl}`
    if (navigator.share) {
      try { await navigator.share({ title: `Sinar — ${prod.name_mm}`, text: shareText, url: SITE.facebookUrl }) }
      catch {}
    } else {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-x-4 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[101] w-auto sm:w-full sm:max-w-lg bg-white border border-hairline rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 sm:translate-y-8"
        }`}
      >
        <div className="flex flex-col sm:flex-row max-h-[90vh] sm:max-h-[80vh]">
          {/* Image */}
          <div className="relative aspect-[3/4] sm:aspect-auto sm:w-56 sm:flex-shrink-0 bg-cream overflow-hidden">
            <img
              src={prod.image_url || FALLBACK_IMG}
              alt={prod.name_en}
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
            />
            {prod.sold_out && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-white text-ink text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Sold Out
                </span>
              </div>
            )}
            {hasDiscount && !prod.sold_out && (
              <div className="absolute top-3 left-3">
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  -{discountPct}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-6 flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-mm font-semibold text-lg text-ink leading-snug">{prod.name_mm}</h3>
                <p className="text-xs text-muted mt-0.5">{prod.name_en}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-cream hover:bg-blush text-muted hover:text-ink transition-colors"
                  title="Share product"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-cream hover:bg-blush text-muted hover:text-ink transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Viewer count */}
            {!prod.sold_out && (
              <div className="flex items-center gap-1.5 mb-4">
                <Eye className="w-3 h-3 text-emerald-500" />
                <span className="text-[11px] text-emerald-600 font-medium">
                  {viewers} people viewing right now
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            )}

            {/* Price */}
            {prod.price > 0 && (
              <div className="mb-4">
                <p className="text-[10px] text-muted uppercase tracking-widest mb-1">Price</p>
                <div className="flex items-baseline gap-2.5">
                  <p className="font-mm font-bold text-deep text-2xl">
                    {prod.price.toLocaleString()} ကျပ်
                  </p>
                  {hasDiscount && (
                    <p className="font-mm text-sm text-muted line-through">
                      {prod.original_price!.toLocaleString()}
                    </p>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-[11px] text-amber-600 font-semibold mt-0.5">
                    You save {(prod.original_price! - prod.price).toLocaleString()} ကျပ် 🎉
                  </p>
                )}
              </div>
            )}

            {/* Sizes */}
            <div className="mb-5">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-2">Sizes</p>
              <div className="flex flex-wrap gap-2">
                {prod.sizes.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-full border border-hairline text-ink text-xs font-bold hover:border-deep hover:text-deep transition-colors cursor-default"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="mb-5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                prod.sold_out ? "bg-red-100 text-red-600" :
                prod.status === "In Stock" ? "bg-emerald-50 text-emerald-700" :
                "bg-amber-50 text-amber-700"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {prod.sold_out ? "Sold Out" : prod.status === "Low Stock" ? "⚡ Almost Gone — မှာဖို့ မစောင့်ပါနှင့်" : prod.status}
              </span>
            </div>

            {/* Order buttons */}
            {!prod.sold_out && (
              <div className="mt-auto space-y-2.5">
                <a
                  href={dmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-deep text-cream py-3 rounded-xl text-sm font-semibold hover:bg-ink transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-mm">Messenger မှ မှာရန်</span>
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={vUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-cream border border-hairline hover:border-violet-400 text-ink hover:text-violet-600 py-3 rounded-xl text-sm transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Viber</span>
                  </a>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-cream border border-hairline hover:border-green-400 text-ink hover:text-green-600 py-3 rounded-xl text-sm transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 w-full bg-cream border border-hairline hover:border-deep text-muted hover:text-ink py-2.5 rounded-xl text-sm transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span className="font-mm">{copied ? "Link ကူးယူပြီးပါပြီ ✓" : "Friend ဆီ Share ရန်"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
