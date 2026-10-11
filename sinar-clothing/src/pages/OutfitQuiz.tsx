import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, RefreshCw, MessageCircle, Sparkles, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { FALLBACK_IMG } from "@/lib/products"
import { useProducts } from "@/lib/useProducts"
import { formatKs } from "@/lib/order"

const QUESTIONS = [
  {
    id: "occasion",
    step: 1,
    question: "ဘယ်နေရာ သွားမှာလဲ?",
    subtitle: "Where are you going?",
    options: [
      { value: "date",    emoji: "💑", label: "Date Night",      mm: "ချိန်းတွေ့မည်" },
      { value: "casual",  emoji: "🛍️", label: "Casual Day Out", mm: "နေ့တိုင်းဝတ်" },
      { value: "work",    emoji: "💼", label: "Work / Office",   mm: "အလုပ်သွား" },
      { value: "party",   emoji: "🎉", label: "Party / Event",   mm: "ပါတီသွား" },
    ],
  },
  {
    id: "vibe",
    step: 2,
    question: "ဒီနေ့ ဘယ် vibe ကျတာလဲ?",
    subtitle: "What's your style today?",
    options: [
      { value: "cute",  emoji: "🌸", label: "Cute & Feminine", mm: "ချိုမြ ချစ်စရာ" },
      { value: "chic",  emoji: "😎", label: "Cool & Chic",     mm: "ဆိုဒ်ကျ မြင့်မြတ်" },
      { value: "comfy", emoji: "🤍", label: "Comfy & Relaxed", mm: "သက်သောင့် ဝတ်ချင်" },
      { value: "bold",  emoji: "✨", label: "Bold & Trendy",   mm: "ထူးထူးဆန်းဆန်း" },
    ],
  },
  {
    id: "color",
    step: 3,
    question: "ဘယ် color တွေ ကြိုက်လဲ?",
    subtitle: "Pick your colour vibe",
    options: [
      { value: "neutral",  emoji: "🤍", label: "Neutrals",  mm: "Beige / White / Cream" },
      { value: "pastel",   emoji: "🌸", label: "Pastels",   mm: "Pink / Lavender / Mint" },
      { value: "dark",     emoji: "🖤", label: "Dark Tones", mm: "Black / Navy / Forest" },
      { value: "colorful", emoji: "🌈", label: "Colorful",  mm: "Bold & Vibrant" },
    ],
  },
]

function getCategories(answers: Record<string, string>): string[] {
  const { occasion, vibe } = answers
  const map: Record<string, Record<string, string[]>> = {
    date:   { cute: ["Dresses","Tops"],           chic: ["Dresses","Cardigans"],        comfy: ["Dresses","Sweaters"],       bold: ["Dresses","Tops"] },
    casual: { cute: ["Tops","Dresses","Jeans"],    chic: ["Tops","Cardigans","Jeans"],   comfy: ["Sweaters","Jeans","Cardigans"], bold: ["Tops","Jeans","Dresses"] },
    work:   { cute: ["Tops","Cardigans","Dresses"], chic: ["Cardigans","Tops","Dresses"], comfy: ["Sweaters","Cardigans","Tops"],  bold: ["Tops","Cardigans","Dresses"] },
    party:  { cute: ["Dresses","Tops"],           chic: ["Dresses","Cardigans"],        comfy: ["Tops","Sweaters","Jeans"],  bold: ["Dresses","Tops"] },
  }
  return map[occasion]?.[vibe] ?? ["Dresses", "Tops", "Cardigans"]
}

function getPersonality(answers: Record<string, string>): { title: string; desc: string } {
  const { occasion, vibe } = answers
  if (occasion === "date"   && vibe === "cute")  return { title: "Romantic Dreamer 🌸", desc: "ချိုမြ ဆိုဒ်နဲ့ Date မှာ ဘယ်သူမဆို မကြည့်မနေနိုင်မဲ့ look" }
  if (occasion === "date"   && vibe === "chic")  return { title: "Effortless Elegance ✨", desc: "Sophisticated ဆိုဒ်နဲ့ Date ကို wow ဖြစ်စေမည်" }
  if (occasion === "date"   && vibe === "comfy") return { title: "Cozy Romance 🤍", desc: "Relaxed ဆိုဒ်နဲ့ ဆိုဒ်ပြည့်မဲ့ date look" }
  if (occasion === "date"   && vibe === "bold")  return { title: "Showstopper 💥", desc: "Bold ဆိုဒ်နဲ့ Date ကို ကိုယ်တိုင် standout ဖြစ်မည်" }
  if (occasion === "work"   && vibe === "chic")  return { title: "Power Dresser 💼", desc: "Professional ဆိုဒ်နဲ့ confidence ပြည့်မဲ့ office look" }
  if (occasion === "work"   && vibe === "cute")  return { title: "Office Sweetheart 🌸", desc: "ချိုမြပြီး professional ကျတဲ့ work look" }
  if (occasion === "work"   && vibe === "comfy") return { title: "Smart Casual 🤍", desc: "Comfortable ဆိုဒ်နဲ့ work ကို effortlessly သွားမည်" }
  if (occasion === "party"  && vibe === "bold")  return { title: "Party Star 🎉", desc: "ပါတီမှာ အားလုံးကို မျက်စိဆွဲမဲ့ standout look" }
  if (occasion === "party"  && vibe === "cute")  return { title: "Party Princess 🌸", desc: "ချိုမြ ဆိုဒ်နဲ့ ပါတီကို sparkle ဖြစ်စေမည်" }
  if (occasion === "casual" && vibe === "comfy") return { title: "Cozy Aesthetic 🤍", desc: "Effortless ဆိုဒ်နဲ့ ဘယ်နေရာသွားသွား ဆိုဒ်ကျမည်" }
  if (occasion === "casual" && vibe === "chic")  return { title: "Street Style Queen 😎", desc: "Casual ဆိုပေမဲ့ ဆိုဒ်ပြည့်မဲ့ street look" }
  if (vibe === "cute")  return { title: "Sweet & Feminine 🌸", desc: "ချိုမြ ဆိုဒ်ပြည့်မဲ့ look — မင်းနဲ့ ကိုက်ညီမည်" }
  if (vibe === "chic")  return { title: "Chic Minimalist 😎", desc: "Clean ဆိုဒ်နဲ့ polished look တစ်ခု" }
  if (vibe === "comfy") return { title: "Relaxed Luxe 🤍", desc: "Comfy ဆိုပေမဲ့ ဆိုဒ်ပြည့်မဲ့ effortless look" }
  return { title: "Trendsetter ✨", desc: "Bold ဆိုဒ်နဲ့ trend ကို lead လုပ်မဲ့ look" }
}

export default function OutfitQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const { products: allProducts } = useProducts()

  const categories = done ? getCategories(answers) : []
  const recommended = done
    ? categories
        .flatMap((cat) => allProducts.filter((p) => p.category === cat && !p.sold_out))
        .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
        .slice(0, 3)
    : []

  const personality = done ? getPersonality(answers) : { title: "", desc: "" }

  function pick(value: string) {
    setSelected(value)
    setTimeout(() => {
      const q = QUESTIONS[step]
      const next = { ...answers, [q.id]: value }
      setAnswers(next)
      setSelected(null)
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1)
      } else {
        setDone(true)
      }
    }, 260)
  }

  function restart() {
    setStep(0)
    setAnswers({})
    setDone(false)
    setSelected(null)
  }

  const bg = "min-h-screen bg-candy-bg"

  return (
    <div className={bg}>
      {/* Header */}
      <div className={`sticky top-0 z-40 border-b backdrop-blur-xl bg-candy-bg/90 border-candy-line`}>
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          <Link to="/" className="-ml-2 flex h-11 items-center gap-2 px-2 text-sm font-semibold text-candy-muted">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-candy-pink" />
            <span className={`font-display text-base font-semibold text-candy-ink`}>Outfit Finder</span>
          </div>
          {!done && (
            <span className={`text-xs font-bold text-candy-muted`}>
              {step + 1} / {QUESTIONS.length}
            </span>
          )}
          {done && (
            <button onClick={restart} className="-mr-2 flex h-11 items-center gap-1 px-2 text-xs text-candy-pink font-bold">
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-8">
        <AnimatePresence mode="wait">
          {/* ── Quiz Questions ── */}
          {!done && (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Progress bar */}
              <div className={`w-full h-2 rounded-full mb-8 bg-candy-soft`}>
                <motion.div
                  className="h-full bg-candy-pink rounded-full"
                  initial={{ width: `${(step / QUESTIONS.length) * 100}%` }}
                  animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Question */}
              <div className="mb-8 text-center">
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 text-candy-pink`}>
                  Question {step + 1}
                </p>
                <h1 className={`font-mm text-2xl font-bold mb-1 text-candy-ink`}>
                  {QUESTIONS[step].question}
                </h1>
                <p className={`text-sm text-candy-muted`}>
                  {QUESTIONS[step].subtitle}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {QUESTIONS[step].options.map((opt, i) => {
                  const isSelected = selected === opt.value
                  return (
                    <motion.button
                      key={opt.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      onClick={() => pick(opt.value)}
                      className={`relative flex flex-col items-center gap-3 p-5 rounded-[24px] border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? "border-candy-pink bg-candy-soft scale-95"
                          : "border-candy-line bg-white shadow-soft active:scale-95"
                      }`}
                    >
                      <span className="text-3xl">{opt.emoji}</span>
                      <div>
                        <p className={`text-sm font-bold text-center text-candy-ink`}>
                          {opt.label}
                        </p>
                        <p className={`font-mm text-xs text-center mt-0.5 text-candy-muted`}>
                          {opt.mm}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-[24px] border-2 border-candy-pink"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.15 }}
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ── Results ── */}
          {done && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Personality banner */}
              <div className="bg-candy-lilac rounded-[26px] p-5 text-center">
                <p className={`text-xs uppercase tracking-widest font-bold mb-2 text-[#4B2BB8]`}>
                  မင်းရဲ့ Style Personality
                </p>
                <h2 className={`font-display text-2xl font-semibold mb-1 text-candy-ink`}>
                  {personality.title}
                </h2>
                <p className={`font-mm text-sm text-candy-muted`}>
                  {personality.desc}
                </p>
              </div>

              {/* Recommended products */}
              <div>
                <p className={`text-xs uppercase tracking-widest font-bold mb-4 text-candy-muted`}>
                  မင်းအတွက် ကိုက်ညီမဲ့ outfits ✨
                </p>

                {recommended.length === 0 ? (
                  <div className={`rounded-[24px] p-8 text-center bg-white shadow-soft`}>
                    <p className={`font-mm text-sm text-candy-muted`}>
                      ပစ္စည်းများ load မရသေးပါ — ခေတ္တစောင့်ပါ
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recommended.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 + 0.2 }}
                        className={`flex gap-4 rounded-[24px] overflow-hidden bg-white p-2 shadow-soft`}
                      >
                        {/* Image */}
                        <div className="w-24 h-28 flex-shrink-0 overflow-hidden rounded-2xl bg-candy-soft">
                          <img
                            src={p.image_url || FALLBACK_IMG}
                            alt={p.name_en}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 py-3 pr-3 flex flex-col justify-between min-w-0">
                          <div>
                            <p className={`font-mm font-semibold text-sm truncate text-candy-ink`}>
                              {p.name_mm}
                            </p>
                            <p className={`text-xs truncate mt-0.5 text-candy-muted`}>
                              {p.name_en}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mm font-extrabold text-candy-pink text-sm">
                                {p.price > 0 ? formatKs(p.price) : "ဈေးမေးရန်"}
                              </span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full border border-candy-line text-candy-muted`}>
                                {p.category}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/p/${p.id}`}
                            className="mt-2 inline-flex h-10 items-center gap-1.5 bg-candy-pink text-white text-xs font-bold px-4 rounded-full self-start"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="font-mm">ကြည့်ပြီး မှာမယ်</span>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Browse all CTA */}
              <Link
                to="/shop"
                className="flex h-14 items-center justify-center gap-2 w-full bg-candy-ink text-white rounded-full font-mm text-sm font-bold"
              >
                ပစ္စည်းအားလုံး ကြည့်ရန်
                <ChevronRight className="w-4 h-4" />
              </Link>

              {/* Retry */}
              <button
                onClick={restart}
                className={`flex h-12 items-center justify-center gap-2 w-full rounded-full font-mm text-sm font-semibold text-candy-muted`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                ပြန်စပြီး ထပ်ကြိုးကြည့်ရန်
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
