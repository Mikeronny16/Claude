import Groq from "groq-sdk"

const MODEL = "llama-3.3-70b-versatile"

async function ask(prompt: string): Promise<string> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const res = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 512,
    temperature: 0.8,
  })
  return res.choices[0]?.message?.content?.trim() ?? ""
}

export async function generateCaption(input: {
  product: string
  tone: string
  platform: string
  language: "mm" | "en"
}): Promise<string> {
  const lang = input.language === "mm" ? "Myanmar Unicode" : "English"
  const prompt = `You are a social media expert for Myanmar online sellers.
Write a ${input.platform} caption for: "${input.product}"
Tone: ${input.tone}
Language: ${lang}
Rules:
- If Myanmar: use natural conversational Myanmar Unicode text
- Include 3-5 relevant hashtags
- Keep it engaging and short (under 150 words)
- No explanation, just the caption`

  return ask(prompt)
}

export async function generateReply(input: {
  comment: string
  context: string
  tone: string
  language: "mm" | "en"
}): Promise<string> {
  const lang = input.language === "mm" ? "Myanmar Unicode" : "English"
  const prompt = `You are a Myanmar online seller's customer service assistant.
Customer comment: "${input.comment}"
Business context: "${input.context || "Online clothing/product shop"}"
Reply in: ${lang}
Tone: ${input.tone}
Rules:
- Natural, friendly reply
- Address their concern directly
- Under 80 words
- No explanation, just the reply`

  return ask(prompt)
}

export async function generateDescription(input: {
  product: string
  features: string
  price: string
  language: "mm" | "en"
}): Promise<string> {
  const lang = input.language === "mm" ? "Myanmar Unicode" : "English"
  const prompt = `You are a Myanmar e-commerce copywriter.
Product: "${input.product}"
Features/Details: "${input.features}"
Price: ${input.price ? input.price + " MMK" : "not specified"}
Write in: ${lang}
Rules:
- Compelling product description for Facebook/Telegram shop
- Highlight key features naturally
- Include a call-to-action
- Under 200 words
- No explanation, just the description`

  return ask(prompt)
}
