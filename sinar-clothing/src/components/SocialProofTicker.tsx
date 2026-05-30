import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function makeNotif() {
  return {
    id: Date.now(),
    name: randomItem(NAMES),
    city: randomItem(CITIES),
    product: randomItem(PRODUCTS),
    mins: randomItem(MINS),
  }
}

export default function SocialProofTicker() {
  const [notif, setNotif] = useState<ReturnType<typeof makeNotif> | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function show() {
    setNotif(makeNotif())
    timer.current = setTimeout(() => {
      setNotif(null)
      timer.current = setTimeout(show, randomBetween(28000, 48000))
    }, 5000)
  }

  function randomBetween(a: number, b: number) {
    return Math.floor(Math.random() * (b - a)) + a
  }

  useEffect(() => {
    timer.current = setTimeout(show, randomBetween(6000, 12000))
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [])

  return (
    <div className="fixed bottom-6 left-4 z-[90] pointer-events-none">
      <AnimatePresence>
        {notif && (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -60, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="flex items-center gap-3 bg-[#0F2415] border border-[#1C3020] rounded-2xl shadow-xl px-4 py-3 max-w-[260px]"
          >
            <div className="w-8 h-8 rounded-full bg-pink/15 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-4 h-4 text-pink" />
            </div>
            <div className="min-w-0">
              <p className="font-mm text-xs font-semibold text-[#F5F0E8] truncate">
                {notif.name} ({notif.city})
              </p>
              <p className="text-[10px] text-[#7A8F7D] truncate mt-0.5">
                {notif.product} မှာလိုက်သည် 🛍️
              </p>
              <p className="text-[9px] text-[#4A6350] mt-0.5">{notif.mins} မိနစ်အကြာ</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
