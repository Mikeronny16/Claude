import { Link } from "react-router-dom"
import { useLang } from "@/lib/lang"
import { useProducts } from "@/lib/useProducts"
import { useWishlist } from "@/lib/store"
import ProductCard, { ProductCardSkeleton } from "@/components/app/ProductCard"
import { Garment } from "@/components/app/Garment"

export default function Saved() {
  const { t } = useLang()
  const { products, isLoading } = useProducts()
  const ids = useWishlist()
  const saved = products.filter((p) => ids.includes(String(p.id)))

  return (
    <div>
      <div className="pt-safe flex items-end justify-between px-5 pb-4 pt-4">
        <h1 className="font-display text-[30px] font-bold leading-none">{t("သိမ်းထားတာ", "Saved")}</h1>
        <span className="font-mm text-xs font-semibold text-candy-muted">{saved.length} {t("ခု", "items")}</span>
      </div>

      {isLoading && ids.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 px-4">
          {ids.slice(0, 4).map((id) => <ProductCardSkeleton key={id} />)}
        </div>
      ) : saved.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 px-4">
          {saved.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 px-8 py-16 text-center">
          <span className="relative flex h-32 w-32 items-center justify-center rounded-[40px] bg-candy-soft">
            <Garment kind="dress" className="h-24 w-[72px] animate-floaty" />
          </span>
          <p className="font-mm text-base font-semibold">{t("ဘာမှ သိမ်းမထားရသေးဘူး", "Nothing saved yet")}</p>
          <p className="font-mm max-w-[260px] text-sm text-candy-muted">
            {t("ကြိုက်တဲ့ ဝတ်စုံမှာ နှလုံးပုံလေး နှိပ်ပြီး ဒီမှာ သိမ်းထားလို့ရတယ်", "Tap the heart on anything you love to keep it here")}
          </p>
          <Link to="/shop" className="font-mm mt-2 flex h-12 items-center rounded-full bg-candy-pink px-6 text-sm font-bold text-white shadow-cta">
            {t("ဝတ်စုံ ရွေးမယ်", "Browse the shop")}
          </Link>
        </div>
      )}
    </div>
  )
}
