import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generatePersonality(name: string, lang: "mm" | "en"): Promise<PersonalityResult> {
  const isMM = lang === "mm"

  const system = isMM
    ? `သင်သည် မြန်မာ့ ရိုးရာ နက်နဲသော အမည်ဆရာ ဖြစ်သည်။ နာမည်တစ်ခုကို ကြည့်ရုံနှင့် လူ့စိတ်ဓာတ်ကို ဖတ်တတ်သည်။
မြန်မာ့ ဗေဒင်ပညာ၊ နတ်ဝိညာဉ် ဆိုင်ရာ ပညာ၊ နှင့် ခေတ်မီ စိတ်ပညာ တို့ကို ပေါင်းစပ်၍ reading ပြုလုပ်သည်။
သဘာဝကျသော မြန်မာဘာသာဖြင့် ရေးသားပါ — ဘာသာပြန်ထားသောဟန် မဟုတ်ဘဲ မြန်မာ့ သဘာဝ ဆန်ဆန် ရေးပါ။
ကဗျာဆန်ဆန်၊ နည်းနည်း ဒရာမာဆန်ဆန် ဖြင့် ဖော်ပြပါ — ဖတ်သူက "ဒါ ငါပဲ" ဟု ထင်မှတ်စေရမည်။
မြန်မာ Unicode ဖြင့် ပြန်ပါ။ field name များသာ English ဖြစ်သည်။`
    : `You are a mystical personality reader who reveals the hidden soul within a name.
You blend numerology, archetype psychology, and cosmic energy into readings that feel personal and shareable.
Be poetic, insightful, and slightly dramatic — make people think "this is SO me".`

  const prompt = isMM
    ? `"${name}" ဆိုသော နာမည်ရှင်၏ personality reading ကို ရေးပေးပါ။
မြန်မာ့ ယဉ်ကျေးမှုဆိုင်ရာ ပညာနှင့် လူ့စိတ်ပညာ ကို ပေါင်းစပ်ပြီး ဖော်ပြပါ။

JSON format တိတိကျကျသာ ပြန်ပါ (markdown မပါပါနှင့်၊ JSON သက်သက်သာ):
{
  "title": "နာမည်ကို ထင်ဟပ်သော ကဗျာဆန်သည့် ခေါင်းစဉ် (ဥပမာ — ငြိမ်သောမင်းသမီး၊ မီးသတ္တိရှင်၊ ကံကောင်းသောနှလုံး)",
  "element": "ဓာတ် — မီး၊ ရေ၊ ကြေး၊ လေ၊ မြေ — တစ်ခုတည်းသာ",
  "spirit_animal": "ကာကွယ်သောတိရစ္ဆာန် နှင့် emoji (ဥပမာ — ဆင် 🐘၊ ခြင်္သေ့ 🦁၊ လင်းယုန် 🦅)",
  "traits": ["ပင်ကိုယ်လက္ခဏာ တစ်ခု", "လက္ခဏာ နှစ်ခု", "လက္ခဏာ သုံးခု", "လက္ခဏာ လေးခု"],
  "strength": "အဓိက အားသာချက်များ — ကဗျာဆန်ဆန်၊ နှစ်ကြောင်း",
  "shadow": "ဂရုစိုက်ရမည့် ကိစ္စ — ကြင်နာသောစကားဖြင့်၊ တစ်ကြောင်း",
  "fortune_2026": "2026 ကံကြမ္မာ — မျှော်လင့်ချက်ပေးသော၊ နှစ်ကြောင်း",
  "love": "ချစ်ခြင်းမေတ္တာ ပုံစံ — တစ်ကြောင်း",
  "lucky_color": "ကံကောင်းစေသောအရောင် (မြန်မာဘာသာဖြင့်)",
  "lucky_number": "ကံဂဏန်း (ဂဏန်းသာ)"
}`
    : `Generate a personality reading for the name "${name}".

Return ONLY valid JSON (no markdown, no extra text):
{
  "title": "poetic archetype title (e.g. The Quiet Storm, The Golden Flame)",
  "element": "Fire / Water / Earth / Air / Ether — one only",
  "spirit_animal": "spirit animal with emoji (e.g. Wolf 🐺, Eagle 🦅)",
  "traits": ["trait one", "trait two", "trait three", "trait four"],
  "strength": "core strengths — poetic and specific, 2 lines",
  "shadow": "honest shadow side — gentle, not harsh, 1 line",
  "fortune_2026": "2026 fortune — hopeful and specific, 2 lines",
  "love": "love personality — 1 line",
  "lucky_color": "lucky color name",
  "lucky_number": "number only"
}`

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1200,
    messages: [
      { role: "user", content: prompt }
    ],
    system,
  })

  const raw = response.content[0].type === "text" ? response.content[0].text.trim() : ""
  // Strip markdown code fences if Claude wraps output in ```json ... ```
  const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim()
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`Invalid response format. Raw: ${raw.slice(0, 200)}`)

  return JSON.parse(jsonMatch[0]) as PersonalityResult
}

export interface PersonalityResult {
  title: string
  element: string
  spirit_animal: string
  traits: string[]
  strength: string
  shadow: string
  fortune_2026: string
  love: string
  lucky_color: string
  lucky_number: string
}
