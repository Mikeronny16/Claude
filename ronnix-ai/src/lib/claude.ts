import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generatePersonality(name: string, lang: "mm" | "en"): Promise<PersonalityResult> {
  const isMM = lang === "mm"

  const system = isMM
    ? `You are a mystical Myanmar fortune teller who reads personalities through names.
You blend astrology, Myanmar spirit wisdom, and modern psychology.
Your readings feel accurate, personal, and slightly poetic — not generic.
Always respond in Myanmar Unicode (Burmese) with English field names.
Be fun, slightly dramatic, and share-worthy. Make people think "this is SO me".`
    : `You are a mystical personality reader who reveals the hidden soul within a name.
You blend numerology, archetype psychology, and cosmic energy into readings that feel personal and shareable.
Be poetic, insightful, and slightly dramatic — make people think "this is SO me".`

  const prompt = isMM
    ? `"${name}" ဆိုတဲ့ နာမည်ရဲ့ personality reading ရေးပေးပါ။

ဒီ JSON format နဲ့ ပြန်ပါ (JSON only, no extra text):
{
  "title": "နာမည်ကို reflect တဲ့ poetic title (e.g. ရဲသောနှလုံးရှင်)",
  "element": "သဘာဝ ဓာတ် (မီး/ရေ/ကြေး/လေ/မြေ)",
  "spirit_animal": "Myanmar spirit animal နဲ့ emoji (e.g. ကျား 🐯)",
  "traits": ["trait 1", "trait 2", "trait 3"],
  "strength": "အဓိက strengths (1-2 ကြောင်း, poetic)",
  "shadow": "shadow side — honest but not harsh (1 ကြောင်း)",
  "fortune_2026": "2026 fortune (hopeful, specific feeling, 1-2 ကြောင်း)",
  "love": "love personality (1 ကြောင်း)",
  "lucky_color": "lucky color (Myanmar name)",
  "lucky_number": "number only"
}`
    : `Generate a personality reading for the name "${name}".

Return ONLY this JSON (no extra text):
{
  "title": "poetic archetype title (e.g. The Quiet Storm)",
  "element": "Fire / Water / Earth / Air / Ether",
  "spirit_animal": "spirit animal with emoji (e.g. Wolf 🐺)",
  "traits": ["trait 1", "trait 2", "trait 3"],
  "strength": "core strength (1-2 lines, poetic and specific)",
  "shadow": "honest shadow side — not harsh (1 line)",
  "fortune_2026": "2026 fortune (hopeful and specific, 1-2 lines)",
  "love": "love personality (1 line)",
  "lucky_color": "lucky color name",
  "lucky_number": "number only"
}`

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 600,
    messages: [
      { role: "user", content: prompt }
    ],
    system,
  })

  const raw = response.content[0].type === "text" ? response.content[0].text.trim() : ""
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error("Invalid response format")

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
