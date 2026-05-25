import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

export async function generateCaption(input: {
  product: string
  tone: string
  platform: string
  language: "mm" | "en"
}): Promise<string> {
  const lang = input.language === "mm" ? "Myanmar (Unicode)" : "English"
  const prompt = `You are a social media expert for Myanmar online sellers.
Write a ${input.platform} caption for: "${input.product}"
Tone: ${input.tone}
Language: ${lang}
Rules:
- If Myanmar: use natural conversational Myanmar Unicode text
- Include 3-5 relevant hashtags
- Keep it engaging and short (under 150 words)
- No explanation, just the caption`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function generateReply(input: {
  comment: string
  context: string
  tone: string
  language: "mm" | "en"
}): Promise<string> {
  const lang = input.language === "mm" ? "Myanmar (Unicode)" : "English"
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

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export async function generateDescription(input: {
  product: string
  features: string
  price: string
  language: "mm" | "en"
}): Promise<string> {
  const lang = input.language === "mm" ? "Myanmar (Unicode)" : "English"
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

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}
