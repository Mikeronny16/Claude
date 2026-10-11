import { Link } from "react-router-dom"
import { MessageCircle, Minus, Phone, Plus, Trash2 } from "lucide-react"
import { MESSENGER_URL, VIBER_URL, whatsappUrl } from "@/config"
import { useLang } from "@/lib/lang"
import { FALLBACK_IMG } from "@/lib/products"
import { useProducts } from "@/lib/useProducts"
import { clearBag, setBagQty, setBagSize, useBag } from "@/lib/store"
import { copyOrder, formatKs, orderMessage } from "@/lib/order"
import { Garment } from "./Garment"
import Sheet from "./Sheet"

export default function BagSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useLang()
  const bag = useBag()
  const { products } = useProducts()

  const lines = bag.flatMap((item) => {
    const product = products.find((p) => String(p.id) === item.id)
    return product ? [{ item, product }] : []
  })
  const total = lines.reduce((sum, l) => sum + l.product.price * l.item.qty, 0)
  const message = orderMessage(lines.map((l) => ({ product: l.product, size: l.item.size, color: l.item.color, qty: l.item.qty })))
  const missingSize = lines.some((l) => !l.item.size && (l.product.sizes ?? []).length > 0)

  const footer = lines.length > 0 && (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between">
        <span className="font-mm text-sm font-semibold text-candy-muted">{t("စုစုပေါင်း", "Total")}</span>
        <span className="font-display text-2xl font-bold text-candy-pink">{formatKs(total)}</span>
      </div>
      {missingSize && (
        <p className="font-mm -mt-1 text-xs font-semibold text-[#9A3412]">
          {t("Size မရွေးရသေးတာ ရှိတယ် — Chat ထဲမှာ ပြောလို့လည်း ရပါတယ်", "Some items have no size yet — you can tell us in chat")}
        </p>
      )}
      <a
        href={MESSENGER_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => copyOrder(message, lang)}
        className="font-mm flex h-14 items-center justify-center gap-2 rounded-full bg-candy-pink text-[15px] font-bold text-white shadow-cta active:scale-[0.98]"
      >
        <MessageCircle className="h-5 w-5" strokeWidth={2.3} />
        {t("Messenger နဲ့ မှာမယ်", "Order on Messenger")}
      </a>
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={VIBER_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => copyOrder(message, lang)}
          className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-candy-line bg-white text-sm font-bold active:bg-candy-soft"
        >
          <Phone className="h-4 w-4" /> Viber
        </a>
        <a
          href={whatsappUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-candy-line bg-white text-sm font-bold active:bg-candy-soft"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </div>
      <p className="font-mm text-center text-[11px] text-candy-muted">
        {t("Order list ကို copy ကူးပေးမယ် — Chat ထဲမှာ Paste လုပ်ရုံပဲ", "We copy your order list — just paste it in the chat")}
      </p>
    </div>
  )

  return (
    <Sheet open={open} onClose={onClose} title={t("ကျွန်ုပ်ရဲ့ Bag", "My bag")} footer={footer || undefined}>
      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="flex h-28 w-28 items-center justify-center rounded-[36px] bg-candy-soft">
            <Garment kind="dress" className="h-20 w-16" />
          </span>
          <p className="font-mm text-base font-semibold">{t("Bag ထဲမှာ ဘာမှ မရှိသေးဘူး", "Your bag is empty")}</p>
          <p className="font-mm max-w-[260px] text-sm text-candy-muted">
            {t("ကြိုက်တဲ့ ဝတ်စုံတွေ ထည့်ပြီး တစ်ခါတည်း မှာလို့ရတယ်", "Add the pieces you love and order them all at once")}
          </p>
          <Link
            to="/shop"
            onClick={onClose}
            className="mt-2 flex h-12 items-center rounded-full bg-candy-ink px-6 text-sm font-bold text-white"
          >
            {t("ဝတ်စုံ ရွေးမယ်", "Start shopping")}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lines.map(({ item, product }) => (
            <div key={item.key} className="flex gap-3 rounded-3xl bg-white p-2.5 shadow-soft">
              <Link to={`/p/${product.id}`} onClick={onClose} className="h-[104px] w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-candy-soft">
                <img src={product.image_url || FALLBACK_IMG} alt={product.name_en} className="h-full w-full object-cover" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mm truncate text-sm font-semibold leading-relaxed">{product.name_mm}</p>
                    <p className="font-mm text-sm font-extrabold text-candy-pink">
                      {product.price > 0 ? formatKs(product.price) : t("ဈေးမေးရန်", "Ask price")}
                      {item.color && <span className="ml-2 text-xs font-semibold text-candy-muted">{item.color}</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => setBagQty(item.key, 0)}
                    aria-label={t("ဖယ်မယ်", "Remove")}
                    className="-mr-1 -mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-candy-muted active:bg-candy-soft"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {(product.sizes ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setBagSize(item.key, s)}
                        aria-pressed={item.size === s}
                        className={`h-9 min-w-9 rounded-full border-2 px-2.5 text-xs font-extrabold ${
                          item.size === s ? "border-candy-pink bg-candy-pink text-white" : "border-candy-line bg-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setBagQty(item.key, item.qty - 1)}
                    aria-label={t("တစ်ခု လျှော့မယ်", "One less")}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-candy-soft text-candy-pink"
                  >
                    <Minus className="h-4 w-4" strokeWidth={2.6} />
                  </button>
                  <span className="w-8 text-center text-sm font-extrabold tabular-nums">{item.qty}</span>
                  <button
                    onClick={() => setBagQty(item.key, item.qty + 1)}
                    aria-label={t("တစ်ခု တိုးမယ်", "One more")}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-candy-soft text-candy-pink"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.6} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clearBag} className="font-mm mx-auto h-10 px-4 text-xs font-semibold text-candy-muted underline">
            {t("Bag ကို ရှင်းမယ်", "Clear bag")}
          </button>
        </div>
      )}
    </Sheet>
  )
}
