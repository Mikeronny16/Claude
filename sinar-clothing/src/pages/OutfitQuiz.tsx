import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, RefreshCw, MessageCircle, Sparkles, ChevronRight } from "lucide-react"
import { supabase, isConfigured, type Product } from "@/lib/supabase"
import { FALLBACK_PRODUCTS, FALLBACK_IMG } from "@/lib/products"
import { messengerUrl } from "@/config"
import { useTheme } from "@/lib/theme"

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
  const { isDark } = useTheme()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const { data: allProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!isConfigured) return FALLBACK_PRODUCTS as unknown as Product[]
      const { data, error } = await supabase.from("products").select("*").order("sort_order")
      if (error || !data?.length) return FALLBACK_PRODUCTS as unknown as Product[]
      return data as Product[]
    },
  })

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

  const bg = isDark
    ? "min-h-screen bg-[#0A1A0F]"
    : "min-h-screen bg-[#FAF7F2]"

  return (
    <div className={bg}>
      {/* Header */}
      <div className={`sticky top-0 z-40 border-b backdrop-blur-xl ${isDark ? "bg-[#0A1A0F]/90 border-white/5" : "bg-[#FAF7F2]/90 border-green-brand/10"}`}>
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          <a href="/" className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? "text-cream/60 hover:text-cream" : "text-green-brand/60 hover:text-green-brand"}`}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </a>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink" />
            <span className={`text-sm font-semibold ${isDark ? "text-cream" : "text-green-brand"}`}>Outfit Finder</span>
          </div>
          {!done && (
            <span className={`text-xs font-bold ${isDark ? "text-cream/40" : "text-green-brand/40"}`}>
              {step + 1} / {QUESTIONS.length}
            </span>
          )}
          {done && (
            <button onClick={restart} className="flex items-center gap-1 text-xs text-pink font-semibold">
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
              <div className={`w-full h-1 rounded-full mb-8 ${isDark ? "bg-white/10" : "bg-green-brand/10"}`}>
                <motion.div
                  className="h-full bg-pink rounded-full"
                  initial={{ width: `${(step / QUESTIONS.length) * 100}%` }}
                  animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Question */}
              <div className="mb-8 text-center">
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? "text-pink/70" : "text-pink/80"}`}>
                  Question {step + 1}
                </p>
                <h1 className={`font-mm text-2xl font-bold mb-1 ${isDark ? "text-cream" : "text-green-brand"}`}>
                  {QUESTIONS[step].question}
                </h1>
                <p className={`text-sm ${isDark ? "text-cream/40" : "text-green-brand/50"}`}>
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
                      className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? "border-pink bg-pink/10 scale-95"
                          : isDark
                          ? "border-white/8 bg-[#0F2415] hover:border-pink/40 hover:bg-[#122B19] active:scale-95"
                          : "border-green-brand/10 bg-white hover:border-pink/40 hover:shadow-md active:scale-95"
                      }`}
                    >
                      <span className="text-3xl">{opt.emoji}</span>
                      <div>
                        <p className={`text-sm font-bold text-center ${isDark ? "text-cream" : "text-green-brand"}`}>
                          {opt.label}
                        </p>
                        <p className={`font-mm text-xs text-center mt-0.5 ${isDark ? "text-cream/40" : "text-green-brand/50"}`}>
                          {opt.mm}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-pink"
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
              <div className="bg-gradient-to-br from-pink/20 to-pink/5 border border-pink/20 rounded-2xl p-5 text-center">
                <p className={`text-xs uppercase tracking-widest font-bold mb-2 ${isDark ? "text-pink/70" : "text-pink"}`}>
                  မင်းရဲ့ Style Personality
                </p>
                <h2 className={`font-mm text-xl font-bold mb-1 ${isDark ? "text-cream" : "text-green-brand"}`}>
                  {personality.title}
                </h2>
                <p className={`font-mm text-sm ${isDark ? "text-cream/60" : "text-green-brand/70"}`}>
                  {personality.desc}
                </p>
              </div>

              {/* Recommended products */}
              <div>
                <p className={`text-xs uppercase tracking-widest font-bold mb-4 ${isDark ? "text-cream/40" : "text-green-brand/50"}`}>
                  မင်းအတွက် ကိုက်ညီမဲ့ outfits ✨
                </p>

                {recommended.length === 0 ? (
                  <div className={`rounded-2xl border p-8 text-center ${isDark ? "border-white/8 bg-[#0F2415]" : "border-green-brand/10 bg-white"}`}>
                    <p className={`font-mm text-sm ${isDark ? "text-cream/50" : "text-green-brand/50"}`}>
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
                        className={`flex gap-4 rounded-2xl border overflow-hidden ${isDark ? "bg-[#0F2415] border-white/8" : "bg-white border-green-brand/10"}`}
                      >
                        {/* Image */}
                        <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-[#0F2415]">
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
                            <p className={`font-mm font-semibold text-sm truncate ${isDark ? "text-cream" : "text-green-brand"}`}>
                              {p.name_mm}
                            </p>
                            <p className={`text-xs truncate mt-0.5 ${isDark ? "text-cream/40" : "text-green-brand/50"}`}>
                              {p.name_en}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mm font-bold text-pink text-sm">
                                {p.price > 0 ? `${p.price.toLocaleString()} ကျပ်` : "ဈေးမေးရန်"}
                              </span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full border ${isDark ? "border-white/10 text-cream/40" : "border-green-brand/10 text-green-brand/50"}`}>
                                {p.category}
                              </span>
                            </div>
                          </div>
                          <a
                            href={messengerUrl(p.name_en)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 bg-pink text-white text-xs font-semibold px-3 py-1.5 rounded-full self-start"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span className="font-mm">မှာရန်</span>
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Browse all CTA */}
              <a
                href="/#shop"
                className="flex items-center justify-center gap-2 w-full border border-pink/30 text-pink py-3.5 rounded-2xl text-sm font-semibold hover:bg-pink/5 transition-colors"
              >
                ပစ္စည်းအားလုံး ကြည့်ရန်
                <ChevronRight className="w-4 h-4" />
              </a>

              {/* Retry */}
              <button
                onClick={restart}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm transition-colors ${isDark ? "text-cream/40 hover:text-cream" : "text-green-brand/40 hover:text-green-brand"}`}
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
