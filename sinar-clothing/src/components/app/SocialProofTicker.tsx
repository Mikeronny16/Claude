import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"

const NAMES = [
  "မေမြတ်နိုး", "နွေဦးသင်းပြာ", "သင်းပြာဝင်း", "ချိုချိုမြင့်",
  "ရွှေမွှေးသက်", "ဆုဆုလှိုင်", "နှင်းဆီဝင်း", "ပြည့်ဖြိုးမြင့်",
  "ကြယ်ဆုပြည့်", "မြတ်သူဇာ", "ဝတ်မှုံရည်", "သီတာကျော်",
]

const CITIES = ["ရန်ကုန်", "မန္တလေး", "နေပြည်တော်", "ပဲခူး", "မော်လမြိုင်", "စစ်ကိုင်း", "တောင်ကြီး"]

const PRODUCTS = [
  "Floral Linen Blouse", "Beige Knit Cardigan", "Pastel Midi Dress",
  "High Waist Jeans", "Ivory Knit Sweater", "Flowy Maxi Dress",
]

const MINS = [1, 2, 3, 5, 7, 8, 10, 12]

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
const between = (a: number, b: number) => Math.floor(Math.random() * (b - a)) + a

function makeNotif() {
  return { id: Date.now(), name: pick(NAMES), city: pick(CITIES), product: pick(PRODUCTS), mins: pick(MINS) }
}

/** "Someone just ordered" pop-up that floats above the tab bar. */
export default function SocialProofTicker() {
  const [notif, setNotif] = useState<ReturnType<typeof makeNotif> | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function show() {
      setNotif(makeNotif())
      timer.current = setTimeout(() => {
        setNotif(null)
        timer.current = setTimeout(show, between(28000, 48000))
      }, 5000)
    }
    timer.current = setTimeout(show, between(8000, 14000))
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[112px] z-[90] mx-auto max-w-lg px-4">
      <AnimatePresence>
        {notif && (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="flex max-w-[270px] items-center gap-3 rounded-2xl bg-white px-3.5 py-3 shadow-candy"
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-candy-soft text-candy-pink">
              <ShoppingBag className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="font-mm block truncate text-xs font-semibold">{notif.name} ({notif.city})</span>
              <span className="font-mm block truncate text-[11px] text-candy-muted">{notif.product} မှာလိုက်သည်</span>
              <span className="font-mm block text-[10px] text-candy-muted/80">{notif.mins} မိနစ်အကြာ</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
