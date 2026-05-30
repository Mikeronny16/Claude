import { useState } from "react"
import { Sparkles, Share2, Check, ArrowLeft, RefreshCw } from "lucide-react"
import { SITE } from "@/config"

interface StyleResult {
  type: string
  emoji: string
  tagline: string
  description: string
  strength: string
  vibe: string
  category: string
  categoryMM: string
  colors: string[]
  gradient: string
  accent: string
}

const STYLE_TYPES: StyleResult[] = [
  {
    type: "Classic Elegance",
    emoji: "👑",
    tagline: "ထိန်းသိမ်းသော လေးနက်မှုရှိ",
    description: "မင်းသည် ကာလလွန်နိုင်သော အသင်ခြင်းကို ကြိုက်သည်။ ရိုးရှင်းပြီး ကြမ်းသော — ဒီ style သည် အမြဲ trend ဖြစ်နေသည်။",
    strength: "သပ်ရပ်ပြီး ဂုဏ်သိက္ခာရှိ — မည်သည့်နေရာမဆို ကောင်းမွန်သောပုံကြည့်ရသည်",
    vibe: "Timeless • Polished • Confident",
    category: "Dresses",
    categoryMM: "ဂါဝန်လေးများ",
    colors: ["bg-slate-800", "bg-cream", "bg-amber-100"],
    gradient: "from-slate-700 to-slate-900",
    accent: "text-amber-600",
  },
  {
    type: "Free Spirit",
    emoji: "🌸",
    tagline: "လွတ်လပ်ရွင်လန်းသော ဝိညာဉ်",
    description: "မင်းသည် ပညာဉ်မှ ထွက်ပြီး ကိုယ်ပိုင်ပုံစံဖြင့် အသက်ရှင်သည်။ ပြောင်းလဲနိုင်ပြီး creative ဖြစ်ပြီး ပျော်ရွင်မှုဖြင့် ဝတ်ဆင်သည်။",
    strength: "မည်သည့်ဝတ်စုံမဆို ကိုယ်ပိုင်ပုံသဏ္ဌာန်ဖြင့် ဆောင်ယူနိုင်သည်",
    vibe: "Bohemian • Carefree • Expressive",
    category: "Tops",
    categoryMM: "အပေါ်ဆောင်းလေးများ",
    colors: ["bg-rose-300", "bg-orange-200", "bg-yellow-200"],
    gradient: "from-rose-400 to-orange-400",
    accent: "text-rose-600",
  },
  {
    type: "Modern Minimalist",
    emoji: "⬜",
    tagline: "နည်းသောအရာ — ပိုကောင်းသည်",
    description: "မင်းသည် unnecessary အရာများကို ဖြတ်တောက်ပြီး essential ဖြစ်သောအရာကိုသာ ရွေးချယ်သည်။ Clean lines နှင့် neutral tones — simplicity သည် sophistication ဖြစ်သည်",
    strength: "Mix and match ပြုလုပ်ရ လွယ်ကူပြီး ဘာနှင့်မဆို match ဖြစ်သည်",
    vibe: "Clean • Sharp • Intentional",
    category: "Tops",
    categoryMM: "Clean cut အပေါ်ဆောင်းများ",
    colors: ["bg-gray-100", "bg-gray-300", "bg-gray-800"],
    gradient: "from-gray-600 to-gray-900",
    accent: "text-gray-700",
  },
  {
    type: "Romantic Dreamer",
    emoji: "🌷",
    tagline: "နူးညံ့သောနှလုံးသားရှင်",
    description: "မင်းသည် softness နှင့် femininity ကို ချစ်သည်။ Floral patterns၊ delicate fabrics နှင့် dreamy colors — မင်း၏ wardrobe သည် ကဗျာတစ်ပုဒ်ကဲ့သို့ဖြစ်သည်",
    strength: "နူးညံ့ပြီး စိတ်နှလုံးနဆောင်သည် — လူများသည် မင်းနှင့် ဆက်ဆံရ ပျော်သည်",
    vibe: "Soft • Feminine • Dreamy",
    category: "Dresses",
    categoryMM: "ချစ်စရာ ဂါဝန်လေးများ",
    colors: ["bg-pink-200", "bg-rose-100", "bg-purple-100"],
    gradient: "from-pink-400 to-rose-500",
    accent: "text-pink-600",
  },
  {
    type: "Street Chic",
    emoji: "🔥",
    tagline: "လမ်းပေါ်မှ ပိုင်ရှင်",
    description: "မင်းသည် comfortable ဖြစ်ပြီး stylish ဖြစ်ရန် ကြိုးစားသည်။ Casual vibes ကို cool ဖြစ်အောင် ဆောင်ကြဉ်းနိုင်သည် — street style သည် မင်း၏ art form ဖြစ်သည်",
    strength: "effortlessly cool — ဘာမဆို ဝတ်ဆင်ဆင် trend ဖြစ်နေတတ်သည်",
    vibe: "Urban • Bold • Effortless",
    category: "Jeans",
    categoryMM: "Cool ဂျင်းလေးများ",
    colors: ["bg-zinc-800", "bg-red-500", "bg-zinc-400"],
    gradient: "from-zinc-700 to-zinc-900",
    accent: "text-red-500",
  },
  {
    type: "Cozy Luxe",
    emoji: "✨",
    tagline: "သုခဖြင့် ပြည့်နှက်",
    description: "မင်းသည် comfortable ဖြစ်ပြီး luxurious ဖြစ်ရန် ရွေးချယ်သည်။ Soft knitwear၊ cozy sweaters — မင်းအတွက် fashion သည် feeling ဖြစ်သည်",
    strength: "ပညာရည်ရှိပြီး ကိုယ်ကို ချစ်တတ်သည် — self-care ကို lifestyle ဖြင့် ဖော်ပြသည်",
    vibe: "Comfortable • Elevated • Warm",
    category: "Sweaters",
    categoryMM: "Cozy ဆွယ်တာလေးများ",
    colors: ["bg-amber-100", "bg-orange-100", "bg-yellow-50"],
    gradient: "from-amber-500 to-orange-500",
    accent: "text-amber-700",
  },
]

const QUESTIONS = [
  {
    q: "Weekend မှာ ဘာလုပ်ချင်တာများသလဲ?",
    options: [
      { label: "☕ Cafe တွင် လေ့လာဖတ်ရှုမည်", value: 0 },
      { label: "🌳 Nature walk သွားမည်", value: 1 },
      { label: "🏙️ City explore လုပ်မည်", value: 4 },
      { label: "🛋️ Home တွင် relax ယူမည်", value: 5 },
    ],
  },
  {
    q: "မင်း favorite color palette ဘာလဲ?",
    options: [
      { label: "🖤 Black, White, Navy — timeless", value: 0 },
      { label: "🌸 Soft pinks & lavender", value: 3 },
      { label: "🔥 Bold & contrasting colors", value: 4 },
      { label: "🌿 Earthy & warm tones", value: 1 },
    ],
  },
  {
    q: "Date night အတွက် ဘာဝတ်မလဲ?",
    options: [
      { label: "👗 Little black dress — classic", value: 0 },
      { label: "🌸 Floral midi dress", value: 3 },
      { label: "👖 Chic jeans + blazer", value: 2 },
      { label: "✨ Whatever feels cozy & cute", value: 5 },
    ],
  },
  {
    q: "Shopping ဆိုရင် ဘာကို ပထမဆုံး ကြည့်သလဲ?",
    options: [
      { label: "🏷️ Brand & quality", value: 0 },
      { label: "🎨 Unique prints & patterns", value: 1 },
      { label: "📐 Clean silhouette", value: 2 },
      { label: "💕 Cute & feminine details", value: 3 },
    ],
  },
  {
    q: "Fashion icon ဘယ်သူနဲ့ အနီးစပ်ဆုံးလဲ?",
    options: [
      { label: "👑 Audrey Hepburn — timeless elegance", value: 0 },
      { label: "🎸 Zendaya — fearless & bold", value: 4 },
      { label: "🌺 Lily James — romantic & soft", value: 3 },
      { label: "🌙 Hailey Bieber — effortless cool", value: 2 },
    ],
  },
]

function getResult(answers: number[]): StyleResult {
  const counts = [0, 0, 0, 0, 0, 0]
  answers.forEach((a) => counts[a]++)
  const max = Math.max(...counts)
  const idx = counts.indexOf(max)
  return STYLE_TYPES[idx]
}

export default function StyleQuiz() {
  const [step, setStep] = useState<"intro" | "quiz" | "result">("intro")
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<StyleResult | null>(null)
  const [copied, setCopied] = useState(false)

  function handleAnswer(value: number) {
    const newAnswers = [...answers, value]
    if (qIndex < QUESTIONS.length - 1) {
      setAnswers(newAnswers)
      setQIndex(qIndex + 1)
    } else {
      const res = getResult(newAnswers)
      setResult(res)
      setStep("result")
    }
  }

  function restart() {
    setStep("intro")
    setQIndex(0)
    setAnswers([])
    setResult(null)
    setCopied(false)
  }

  async function handleShare() {
    if (!result) return
    const text = `✨ Sinar Clothing — Fashion Style Quiz\n\nငါ့ style က "${result.type}" ${result.emoji}\n${result.tagline}\n\n${result.vibe}\n\nမင်းရဲ့ style ကိုလည်း စစ်ကြည့်ပါ → ${SITE.facebookUrl}`
    if (navigator.share) {
      try { await navigator.share({ title: "My Fashion Style", text }) } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-hairline px-4 py-4 flex items-center justify-between">
        <a href="/" className="font-serif text-xl text-ink flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          {SITE.name}
        </a>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-500">
          <Sparkles className="w-3.5 h-3.5" />
          Style Quiz
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Intro */}
          {step === "intro" && (
            <div className="text-center space-y-6">
              <div className="text-6xl">✨</div>
              <div>
                <h1 className="font-serif text-3xl text-ink mb-2">Fashion Style Quiz</h1>
                <p className="font-mm text-muted text-sm">မင်းရဲ့ fashion personality ဘာလဲ စစ်ကြည့်ပါ</p>
              </div>
              <div className="bg-white rounded-2xl border border-hairline p-5 text-left space-y-3">
                {["မေးခွန်း ၅ ခုသာ ဖြေရမည်", "Login မလိုဘဲ အခမဲ့ စစ်နိုင်သည်", "မင်းနှင့်ကိုက်ညီသော Sinar ဝတ်စုံများ ညွှန်ပေးမည်"].map((t) => (
                  <div key={t} className="flex items-center gap-3 text-sm font-mm text-ink">
                    <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center flex-shrink-0 text-xs">✓</span>
                    {t}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep("quiz")}
                className="w-full bg-deep text-cream py-4 rounded-2xl font-mm font-semibold text-base hover:bg-ink transition-colors"
              >
                စတင်မည် →
              </button>
            </div>
          )}

          {/* Quiz */}
          {step === "quiz" && (
            <div className="space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted font-mm">
                  <span>မေးခွန်း {qIndex + 1} / {QUESTIONS.length}</span>
                  <span>{Math.round(((qIndex) / QUESTIONS.length) * 100)}% ပြီးပြီ</span>
                </div>
                <div className="h-2 bg-hairline rounded-full overflow-hidden">
                  <div
                    className="h-full bg-deep rounded-full transition-all duration-500"
                    style={{ width: `${((qIndex) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-hairline p-6">
                <h2 className="font-mm font-semibold text-ink text-lg mb-6 leading-snug">
                  {QUESTIONS[qIndex].q}
                </h2>
                <div className="space-y-3">
                  {QUESTIONS[qIndex].options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleAnswer(opt.value)}
                      className="w-full text-left px-4 py-3.5 rounded-xl border border-hairline bg-cream hover:bg-blush hover:border-deep text-sm font-mm text-ink transition-all duration-200 active:scale-[0.98]"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Result */}
          {step === "result" && result && (
            <div className="space-y-5">
              {/* Result card */}
              <div className={`rounded-3xl bg-gradient-to-br ${result.gradient} text-white p-7 text-center shadow-lg`}>
                <div className="text-5xl mb-4">{result.emoji}</div>
                <div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">
                  မင်း Fashion Style
                </div>
                <h2 className="font-serif text-2xl font-bold mb-1">{result.type}</h2>
                <p className="font-mm text-sm opacity-90 mb-4">{result.tagline}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {result.vibe.split(" • ").map((v) => (
                    <span key={v} className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl border border-hairline p-5 space-y-4">
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-widest mb-1.5">Personality</p>
                  <p className="font-mm text-sm text-ink leading-relaxed">{result.description}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-widest mb-1.5">Strong Point</p>
                  <p className="font-mm text-sm text-ink leading-relaxed">{result.strength}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-widest mb-1.5">Sinar မှ Recommend</p>
                  <p className={`font-mm font-semibold text-sm ${result.accent}`}>
                    {result.categoryMM} ကို ကြည့်ပါ →
                  </p>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="space-y-3">
                <a
                  href={`/#shop`}
                  className="flex items-center justify-center gap-2 w-full bg-deep text-cream py-3.5 rounded-2xl font-mm font-semibold text-sm hover:bg-ink transition-colors"
                >
                  Sinar ဝတ်စုံများ ကြည့်မည် 🛍️
                </a>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 w-full bg-white border border-hairline py-3.5 rounded-2xl font-mm text-sm text-ink hover:bg-cream transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                  {copied ? "Link ကူးယူပြီးပါပြီ ✓" : "Friend ဆီ Share မည်"}
                </button>
                <button
                  onClick={restart}
                  className="flex items-center justify-center gap-2 w-full text-muted py-2.5 rounded-2xl text-sm hover:text-ink transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="font-mm">နောက်တစ်ကြိမ် စစ်မည်</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
