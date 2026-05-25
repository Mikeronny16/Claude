import Groq from "groq-sdk"

const MODEL = "llama-3.3-70b-versatile"

async function ask(prompt: string, maxTokens = 600): Promise<string> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const res = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.8,
  })
  return res.choices[0]?.message?.content?.trim() ?? ""
}

const L = (lang: "mm" | "en") => lang === "mm" ? "Myanmar Unicode (Burmese)" : "English"

// ── Original tools ──────────────────────────────────────────

export async function generateCaption(input: {
  product: string; tone: string; platform: string; language: "mm" | "en"
}): Promise<string> {
  return ask(`You are a social media expert for Myanmar online sellers.
Write a ${input.platform} caption for: "${input.product}"
Tone: ${input.tone} | Language: ${L(input.language)}
Rules: natural conversational tone, 3-5 hashtags, under 150 words. Output caption only.`)
}

export async function generateReply(input: {
  comment: string; context: string; tone: string; language: "mm" | "en"
}): Promise<string> {
  return ask(`You are a Myanmar online seller customer service assistant.
Customer comment: "${input.comment}"
Business context: "${input.context || "Online shop"}"
Reply in: ${L(input.language)} | Tone: ${input.tone}
Rules: natural friendly reply, address concern directly, under 80 words. Output reply only.`)
}

export async function generateDescription(input: {
  product: string; features: string; price: string; language: "mm" | "en"
}): Promise<string> {
  return ask(`You are a Myanmar e-commerce copywriter.
Product: "${input.product}" | Features: "${input.features}" | Price: ${input.price ? input.price + " MMK" : "not specified"}
Write in: ${L(input.language)}
Rules: compelling Facebook/Telegram shop description, highlight features, include CTA, under 200 words. Output description only.`)
}

// ── New tools ───────────────────────────────────────────────

export async function generateLiveScript(input: {
  product: string; price: string; benefit: string; duration: string; language: "mm" | "en"
}): Promise<string> {
  return ask(`You are a Myanmar Facebook Live selling coach. Write a complete live script.
Product: "${input.product}" | Price: ${input.price} MMK | Key benefit: "${input.benefit}" | Duration: ${input.duration}
Language: ${L(input.language)}
Structure:
1. Opening hook (greet viewers enthusiastically, create excitement)
2. Product intro (name, price, why it's amazing)
3. Key selling points (3-4 points)
4. Urgency/scarcity line
5. Order CTA (how to order, DM/comment)
Rules: energetic Myanmar live seller voice, natural, conversational. Output script only.`, 900)
}

export async function generatePromo(input: {
  product: string; offer: string; deadline: string; platform: string; language: "mm" | "en"
}): Promise<string> {
  return ask(`You are a viral Myanmar Facebook seller copywriter.
Product: "${input.product}" | Offer: "${input.offer}" | Deadline: "${input.deadline || "Limited time"}" | Platform: ${input.platform}
Language: ${L(input.language)}
Rules: eye-catching, urgency-driven, emoji-heavy Myanmar seller style, under 120 words, 3-5 hashtags. Output post only.`)
}

export async function generateTestimonial(input: {
  raw: string; style: string; language: "mm" | "en"
}): Promise<string> {
  return ask(`Rewrite this customer feedback as a polished shareable testimonial post for a Myanmar online seller.
Original: "${input.raw}" | Style: ${input.style} | Language: ${L(input.language)}
Rules: keep authenticity, add appropriate emoji, format as screenshot-ready testimonial, under 100 words. Output post only.`)
}

export async function generateVariants(input: {
  product: string; platform: string; language: "mm" | "en"
}): Promise<string> {
  return ask(`Generate 3 different caption variations for the same Myanmar seller product.
Product: "${input.product}" | Platform: ${input.platform} | Language: ${L(input.language)}
Output exactly in this format:
✦ Version 1 — Professional:
[caption with hashtags]

✦ Version 2 — Fun & Casual:
[caption with hashtags]

✦ Version 3 — Urgency & Sales:
[caption with hashtags]`, 800)
}

export async function generateHashtags(input: {
  product: string; category: string; platform: string; language: "mm" | "en"
}): Promise<string> {
  return ask(`Generate optimal hashtags for a Myanmar ${input.category || "online"} seller on ${input.platform}.
Product/Content: "${input.product}" | Language: ${L(input.language)}
Output 15-20 hashtags grouped as:
🔥 Trending Myanmar seller tags:
📦 Product-specific:
📍 Location/platform:
Rules: mix Myanmar and English hashtags, include popular Myanmar seller community tags.`)
}

export async function generateComparison(input: {
  product: string; advantages: string; language: "mm" | "en"
}): Promise<string> {
  return ask(`Write a "Why choose us" comparison post for a Myanmar online seller.
Product/Shop: "${input.product}" | Key advantages: "${input.advantages}"
Language: ${L(input.language)}
Rules: confident value-focused tone, not aggressive, under 150 words, hashtags included. Output post only.`)
}

export async function generateReel(input: {
  topic: string; hook: string; platform: string; language: "mm" | "en"
}): Promise<string> {
  return ask(`Write a short punchy caption for a ${input.platform} Reel/Story for a Myanmar seller.
Content: "${input.topic}" | Hook angle: "${input.hook || "product showcase"}" | Language: ${L(input.language)}
Rules: under 50 words, strong opening hook, trending Myanmar seller style, 3-5 hashtags. Output caption only.`)
}

export async function generateSeasonal(input: {
  festival: string; product: string; offer: string; language: "mm" | "en"
}): Promise<string> {
  return ask(`Write a ${input.festival} festival promotional post for a Myanmar online seller.
Product: "${input.product}" | Offer/Message: "${input.offer}"
Language: ${L(input.language)}
Rules: festive celebratory tone, culturally appropriate Myanmar, greeting + product + CTA, under 150 words, seasonal hashtags. Output post only.`)
}
