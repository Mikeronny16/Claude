import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Share2, Check, ArrowLeft, RefreshCw } from "lucide-react"
import { SITE } from "@/config"
import { Link } from "react-router-dom"

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
  glowColor: string
}

const STYLES: StyleResult[] = [
  {
    type: "Classic Elegance",
    emoji: "🌹",
    tagline: "ယဉ်ကျေးသော လှပမှု",
    description: "မင်းဟာ နှစ်ခါမကြည့်ဘဲ မနေနိုင်တဲ့ ဆွဲဆောင်မှုရှိသူ — ရိုးရာနဲ့ ပေါ်ပြူလာ ကိုပေါင်းပြီး ကိုယ်ပိုင် အသွင်ဖြင့် ဝတ်ဆင်တတ်တယ်။",
    strength: "ကာလမရွေး style ရှိသူ — trend ကျသွားလည်း မင်း look ကမကျဘူး",
    vibe: "Sophisticated · Timeless · Graceful",
    category: "Dresses",
    categoryMM: "ဝတ်စုံများ",
    colors: ["#D4A5A5", "#C9B99A", "#8B7355"],
    gradient: "from-rose-900/40 to-amber-900/30",
    glowColor: "rgba(212,165,165,0.3)",
  },
  {
    type: "Free Spirit",
    emoji: "🌸",
    tagline: "လွတ်လပ်သော ဝိညာဉ်",
    description: "မင်းဟာ ဘောင်မသတ်မချင်သူ — fashion ကို ကိုယ်ပိုင် art form အဖြစ် သဘောထားပြီး creativity ကို ဝတ်ဆင်မှုဖြင့် ဖော်ပြသူ။",
    strength: "ဘယ်သူမဆို မတူတဲ့ combination — မင်း look ကို copy ဆွဲဖို့ မဖြစ်နိုင်ဘူး",
    vibe: "Creative · Expressive · Unique",
    category: "Tops",
    categoryMM: "ရှပ်အကျီများ",
    colors: ["#E8A87C", "#D4B896", "#A67C52"],
    gradient: "from-orange-900/40 to-yellow-900/30",
    glowColor: "rgba(232,168,124,0.3)",
  },
  {
    type: "Modern Minimalist",
    emoji: "🤍",
    tagline: "ရိုးရိုးပေမဲ့ ထင်ရှားသော",
    description: "မင်းဟာ less is more ကို နားလည်သူ — မလိုအပ်တာမပါဘဲ essential အရာတွေနဲ့ပဲ ပြည့်ဝပြီး ကြည့်လို့ကောင်းတဲ့ look ကို ဖန်တီးတတ်သူ။",
    strength: "ဘာဝတ်ဝတ် ကောင်းတဲ့ talent — wardrobe ရိုးရိုးလေးနဲ့ look မြင့်နိုင်သူ",
    vibe: "Clean · Confident · Effortless",
    category: "Cardigans",
    categoryMM: "ကာဒီဂင်များ",
    colors: ["#D4D4D4", "#A8A8A8", "#6B6B6B"],
    gradient: "from-slate-800/50 to-zinc-800/30",
    glowColor: "rgba(212,212,212,0.2)",
  },
  {
    type: "Romantic Dreamer",
    emoji: "💕",
    tagline: "ကဗျာဆန်သော ချစ်ခြင်း",
    description: "မင်းဟာ လှပမှုကို အမြဲမြင်တတ်သူ — ဘဝကို ကဗျာ poem တစ်ပုဒ်လို သဘောထားပြီး ဝတ်ဆင်မှုမှာပါ တူညီတဲ့ warmth ကို ထည့်သွင်းတတ်သူ။",
    strength: "ဆွဲဆောင်မှုရှိတဲ့ warmth — မင်းနားကနေ လူတွေ ကောင်းကောင်းခံစားရတယ်",
    vibe: "Soft · Warm · Poetic",
    category: "Dresses",
    categoryMM: "ဝတ်စုံများ",
    colors: ["#F4A7B9", "#E8869A", "#D4607A"],
    gradient: "from-pink-900/40 to-rose-900/30",
    glowColor: "rgba(244,167,185,0.35)",
  },
  {
    type: "Street Chic",
    emoji: "⚡",
    tagline: "မြို့ပြ energy",
    description: "မင်းဟာ trend ရဲ့ ရှေ့ဆုံးမှာ ရှိနေသူ — street culture နဲ့ high fashion ကို ပေါင်းစပ်ပြီး ဘယ်နေရာသွားသွား notice ယူသူ။",
    strength: "Trend-setter energy — တခြားသူတွေ မင်း look ကို ကြည့်ပြီး follow တတ်ကြတယ်",
    vibe: "Bold · Dynamic · Current",
    category: "Jeans",
    categoryMM: "ဂျင်းဘောင်းဘီများ",
    colors: ["#4A9ECA", "#2E7DB5", "#1A5F9A"],
    gradient: "from-blue-900/40 to-cyan-900/30",
    glowColor: "rgba(74,158,202,0.3)",
  },
  {
    type: "Cozy Luxe",
    emoji: "✨",
    tagline: "သက်တောင့်သက်သာ ဆန်းကျယ်မှု",
    description: "မင်းဟာ comfort နဲ့ style ကို တပြိုင်နက် ရနိုင်ကြောင်း ယုံကြည်သူ — soft texture နဲ့ rich tone တွေကို ချစ်ပြီး ကိုယ်ကျေနပ်မှ ကောင်းမြင်တာကို နားလည်သူ။",
    strength: "ဘာမဆို လှပစေနိုင်တဲ့ grace — comfort ထဲမှာ confidence ရှိသူ",
    vibe: "Luxurious · Comfortable · Rich",
    category: "Sweaters",
    categoryMM: "ဆွယ်တာများ",
    colors: ["#9B8EA3", "#7B6E85", "#5C5068"],
    gradient: "from-purple-900/40 to-violet-900/30",
    glowColor: "rgba(155,142,163,0.3)",
  },
]

function getStyleForName(name: string): StyleResult {
  if (!name.trim()) return STYLES[0]
  const n = name.trim().split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  return STYLES[n % STYLES.length]
}

export default function StyleQuiz() {
  const [name, setName] = useState("")
  const [result, setResult] = useState<StyleResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const bg = "bg-candy-bg"
  const textMain = "text-candy-ink"
  const textMuted = "text-candy-muted"
  const cardBg = "bg-white"
  const border = "border-candy-line"
  const inputBg = "bg-candy-bg border-candy-line text-candy-ink placeholder-candy-muted/70"

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setTimeout(() => {
      setResult(getStyleForName(name))
      setLoading(false)
    }, 900)
  }

  async function handleShare() {
    if (!result) return
    const text = `✨ Sinar Style Reading\n\nငါ့ fashion style က "${result.type}" (${result.tagline}) တဲ့!\n${result.vibe}\n\n"${result.strength}"\n\nမင်းရဲ့ style ကဘာလဲ? → ${SITE.facebookUrl}`
    if (navigator.share) {
      try { await navigator.share({ title: `My Style: ${result.type}`, text, url: SITE.facebookUrl }) } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={`min-h-screen ${bg} flex flex-col items-center px-4 py-8 transition-colors duration-300`}>
      {/* Back link */}
      <div className="w-full max-w-md mb-6">
        <Link to="/" className={`inline-flex h-11 items-center gap-1.5 font-mm text-sm font-semibold ${textMuted}`}>
          <ArrowLeft className="w-4 h-4" /> Sinar သို့ ပြန်သွားရန်
        </Link>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 max-w-md"
      >
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-[22px] bg-candy-pink text-white shadow-cta"><Sparkles className="h-7 w-7" /></div>
        <h1 className={`font-display text-2xl sm:text-3xl font-bold ${textMain} mb-2`}>
          မင်းရဲ့ Fashion Style
        </h1>
        <p className={`text-sm ${textMuted} font-mm`}>
          နာမည်ထည့်လိုက် — AI က မင်းရဲ့ style personality ကို ဖော်ပြပေးမည်
        </p>
      </motion.div>

      {/* Input form */}
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleGenerate}
            className={`w-full max-w-md ${cardBg} rounded-[26px] border-2 ${border} p-6 shadow-candy`}
          >
            <label className={`text-xs font-semibold uppercase tracking-widest ${textMuted} block mb-2`}>
              မင်းနာမည်
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ဥပမာ — သူဇာ, မိုက်, Aye Aye..."
              className={`w-full h-14 border-2 rounded-2xl px-4 text-base font-mm focus:outline-none focus:border-candy-pink transition-colors mb-4 ${inputBg}`}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full h-14 bg-candy-pink text-white rounded-full font-mm font-bold text-[15px] flex items-center justify-center gap-2 shadow-cta transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                  <span>ခွဲခြမ်းစိတ်ဖြာနေသည်...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Style ဖော်ထုတ်မည်</span>
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md space-y-4"
          >
            {/* Result card */}
            <div
              className="relative rounded-[26px] overflow-hidden"
              style={{ background: "#fff", boxShadow: `0 0 40px ${result.glowColor}` }}
            >
              {/* Gradient top bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${result.gradient.replace("from-", "from-").replace("/40", "").replace("/30", "")}`}
                style={{ background: `linear-gradient(90deg, ${result.colors[0]}, ${result.colors[2]})` }}
              />

              <div className="p-6">
                {/* Type + emoji */}
                <div className="text-center mb-5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, delay: 0.1 }}
                    className="text-5xl mb-3"
                  >
                    {result.emoji}
                  </motion.div>
                  <p className={`text-xs uppercase tracking-[0.3em] font-semibold mb-1`}
                    style={{ color: result.colors[0] }}>
                    မင်းရဲ့ Fashion Style
                  </p>
                  <h2 className={`font-display text-2xl font-bold ${textMain} mb-1`}>{result.type}</h2>
                  <p className={`font-mm text-sm ${textMuted}`}>{result.tagline}</p>
                </div>

                {/* Vibe pills */}
                <div className="flex flex-wrap justify-center gap-2 mb-5">
                  {result.vibe.split(" · ").map((v) => (
                    <span key={v} className="px-3 py-1 rounded-full text-[11px] font-semibold border"
                      style={{ borderColor: result.colors[0] + "55", color: result.colors[0], background: result.colors[0] + "18" }}>
                      {v}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className={`font-mm text-sm leading-relaxed ${textMuted} text-center mb-4`}>
                  {result.description}
                </p>

                {/* Strength */}
                <div className="rounded-xl p-4 mb-4 border" style={{ background: result.colors[0] + "12", borderColor: result.colors[0] + "30" }}>
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-1" style={{ color: result.colors[0] }}>
                    ✦ မင်းရဲ့ အားသာချက်
                  </p>
                  <p className={`font-mm text-sm ${textMain}`}>{result.strength}</p>
                </div>

                {/* Recommended from Sinar */}
                <div className={`rounded-xl p-4 border ${border}`}>
                  <p className={`text-[10px] uppercase tracking-widest font-bold mb-2 ${textMuted}`}>
                    👗 Sinar မှ မင်းအတွက်
                  </p>
                  <p className={`font-mm text-sm font-semibold ${textMain}`}>
                    {result.categoryMM} — {result.category} collection
                  </p>
                  <Link
                    to={`/shop?cat=${result.category}`}
                    className="inline-flex h-10 items-center gap-1.5 mt-1 font-mm text-sm font-bold text-candy-pink"
                  >
                    ကြည့်ရှုမည် →
                  </Link>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex-1 flex h-12 items-center justify-center gap-2 rounded-full bg-candy-pink text-white font-mm text-sm font-bold shadow-cta"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? "Link ကူးပြီး ✓" : "Friends ဆီ Share"}
              </button>
              <button
                onClick={() => { setResult(null); setName("") }}
                aria-label="Try again"
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white ${border} ${textMuted}`}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-center text-[11px] ${textMuted}`}>
              Powered by <span className="text-candy-pink font-semibold">Sinar</span> Style AI
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
