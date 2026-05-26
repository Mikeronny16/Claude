import OpenAI from "openai"

const MODEL = "gpt-4o-mini"

async function ask(system: string, user: string, maxTokens = 600): Promise<string> {
  const client = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.GITHUB_TOKEN,
  })
  const res = await client.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens,
    temperature: 0.8,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  })
  return res.choices[0]?.message?.content?.trim() ?? ""
}

const L = (lang: "mm" | "en") => lang === "mm" ? "Myanmar Unicode (Burmese)" : "English"

// ── Tools ──────────────────────────────────────────────────────

export async function generateCaption(input: {
  product: string; tone: string; platform: string; language: "mm" | "en"
}): Promise<string> {
  return ask(
    `You are an expert social media copywriter for Myanmar online sellers. You deeply understand Myanmar buying culture, popular seller styles on Facebook/TikTok/Instagram, and what drives engagement in the Myanmar market. Always write naturally as a real Myanmar seller would — not generic AI text.`,
    `Write a ${input.platform} caption for this product: "${input.product}"
Tone: ${input.tone}
Language: ${L(input.language)}

Requirements:
- Hook in the first line (curiosity, benefit, or question)
- Natural Myanmar seller voice — conversational, relatable
- Highlight key benefit or value
- 3-5 relevant hashtags at the end
- Under 150 words
- If Myanmar language: use natural everyday Burmese, not formal

Output the caption only.`
  )
}

export async function generateReply(input: {
  comment: string; context: string; tone: string; language: "mm" | "en"
}): Promise<string> {
  return ask(
    `You are a professional customer service assistant for Myanmar online businesses. You handle customer comments with warmth, speed, and helpfulness. You understand Myanmar customer psychology — they value politeness, quick responses, and feeling heard.`,
    `Customer comment: "${input.comment}"
Shop context: "${input.context || "Online shop"}"
Reply tone: ${input.tone}
Language: ${L(input.language)}

Requirements:
- Address the customer's concern directly
- Warm and friendly — make them feel valued
- If complaint: apologize briefly, offer solution
- If question: answer clearly with confidence
- Under 80 words
- If Myanmar language: use polite natural Burmese (ကျေးဇူးပါ, ရပါတယ် style)

Output the reply only.`
  )
}

export async function generateDescription(input: {
  product: string; features: string; price: string; language: "mm" | "en"
}): Promise<string> {
  return ask(
    `You are a top Myanmar e-commerce copywriter who creates product descriptions that sell. You know what Myanmar online shoppers care about: value, trust, quality proof, and easy ordering. Your descriptions convert browsers into buyers.`,
    `Product: "${input.product}"
Features/Details: "${input.features}"
Price: ${input.price ? input.price + " MMK" : "not specified"}
Language: ${L(input.language)}

Write a compelling Facebook/Telegram shop description:
- Opening: attention-grabbing product intro
- Features: 3-4 key selling points (use emoji bullets)
- Value: why it's worth the price
- Trust signal: quality, authenticity, or guarantee mention
- CTA: clear order instruction (DM, comment "ORDER", etc.)
- Under 200 words

Output the description only.`
  )
}

export async function generateLiveScript(input: {
  product: string; price: string; benefit: string; duration: string; language: "mm" | "en"
}): Promise<string> {
  return ask(
    `You are Myanmar's top Facebook Live selling coach. You've helped hundreds of sellers go viral with their live streams. You know exactly how to open strong, build excitement, handle viewers, create urgency, and close sales. Your scripts feel real — not robotic.`,
    `Product: "${input.product}"
Price: ${input.price} MMK
Key benefit: "${input.benefit}"
Live duration: ${input.duration}
Language: ${L(input.language)}

Write a complete live selling script with these sections:

🎬 OPENING (30 sec) — greet viewers by name feel, create excitement, tease the product
📦 PRODUCT INTRO — name it, show price, why today only
⭐ SELLING POINTS — 3-4 benefits with energy
⏰ URGENCY — limited stock / today price only
📲 ORDER CTA — exactly how to order (DM/comment what)
🔁 REPEAT CTA — remind viewers watching live replay

Use real Myanmar live seller energy. Include viewer engagement lines ("မြင်နေတဲ့သူများ hand တစ်ချက်ပေးကြပါ"). Under 400 words.

Output the script only.`,
    1500
  )
}

export async function generatePromo(input: {
  product: string; offer: string; deadline: string; platform: string; language: "mm" | "en"
}): Promise<string> {
  return ask(
    `You are a viral Myanmar Facebook seller copywriter. You create promotional posts that stop the scroll, create FOMO, and drive immediate action. You know Myanmar seller culture deeply — the emoji style, the urgency tactics, the trust builders.`,
    `Product: "${input.product}"
Offer/Deal: "${input.offer}"
Deadline: "${input.deadline || "Limited time"}"
Platform: ${input.platform}
Language: ${L(input.language)}

Write a scroll-stopping promo post:
- Bold opening line (ALL CAPS or emoji emphasis)
- The offer clearly stated
- Why act NOW (deadline, limited stock, price going up)
- Easy order instruction
- 3-5 hashtags
- Emoji-rich Myanmar seller style
- Under 120 words

Output the post only.`
  )
}

export async function generateTestimonial(input: {
  raw: string; style: string; language: "mm" | "en"
}): Promise<string> {
  return ask(
    `You are a Myanmar social media manager who transforms raw customer feedback into shareable, trust-building testimonial posts. You keep the authentic voice of real customers while making it polished enough to repost.`,
    `Original customer feedback: "${input.raw}"
Style: ${input.style}
Language: ${L(input.language)}

Rewrite as a polished shareable testimonial:
- Keep the authentic customer voice
- Add relatable emotion or detail
- Format cleanly for screenshot sharing
- Customer name/emoji avatar style opener
- Star rating or satisfaction indicator
- Under 100 words

Output the testimonial post only.`
  )
}

export async function generateVariants(input: {
  product: string; platform: string; language: "mm" | "en"
}): Promise<string> {
  return ask(
    `You are a Myanmar social media strategist who creates multiple caption angles for the same product. You understand that different audiences respond to different hooks — professional buyers, casual shoppers, and deal hunters all need different messaging.`,
    `Product: "${input.product}"
Platform: ${input.platform}
Language: ${L(input.language)}

Generate 3 distinct caption variations. Each must feel completely different:

✦ Version 1 — Professional & Trustworthy:
[caption — focus on quality, reliability, value]
[3-5 hashtags]

✦ Version 2 — Fun & Relatable:
[caption — casual, emoji-heavy, friendly tone]
[3-5 hashtags]

✦ Version 3 — Urgency & FOMO:
[caption — scarcity, limited offer, act now energy]
[3-5 hashtags]

Output exactly in this format, nothing else.`,
    900
  )
}

export async function generateHashtags(input: {
  product: string; category: string; platform: string; language: "mm" | "en"
}): Promise<string> {
  return ask(
    `You are a Myanmar social media growth expert who knows exactly which hashtags drive reach and sales for Myanmar online sellers. You know the difference between trending tags, niche community tags, and location tags — and how to mix them for maximum visibility.`,
    `Product/Content: "${input.product}"
Category: "${input.category || "online shopping"}"
Platform: ${input.platform}
Language: ${L(input.language)}

Generate 20 optimized hashtags grouped by type:

🔥 Trending Myanmar Seller Tags (5-6):
[high-traffic Myanmar seller community tags]

📦 Product-Specific Tags (6-7):
[niche tags for this exact product/category]

📍 Platform & Discovery Tags (4-5):
[platform-specific and location-based tags]

💡 Engagement Tags (2-3):
[tags that attract genuine buyer interest]

Mix Myanmar and English hashtags. Include popular Myanmar seller community hashtags.

Output exactly in this format.`
  )
}

export async function generateComparison(input: {
  product: string; advantages: string; language: "mm" | "en"
}): Promise<string> {
  return ask(
    `You are a Myanmar brand strategist who helps online sellers stand out from competition. You write "why choose us" posts that build trust and handle objections before customers even ask them. Your tone is confident but never arrogant.`,
    `Product/Shop: "${input.product}"
Key advantages: "${input.advantages}"
Language: ${L(input.language)}

Write a "Why Choose Us" post:
- Opening: acknowledge customer choice (they have options)
- 3-4 specific advantages (not vague claims — be concrete)
- Trust signals: experience, reviews, guarantee, or quality proof
- Confident CTA
- Under 150 words, hashtags included
- Tone: confident and honest, not salesy or desperate

Output the post only.`
  )
}

export async function generateReel(input: {
  topic: string; hook: string; platform: string; language: "mm" | "en"
}): Promise<string> {
  return ask(
    `You are a Myanmar short-form video content strategist. You write captions for Reels and TikToks that make people stop scrolling, watch the video, and follow. You know that the caption must complement the visual — it adds context, curiosity, or humor.`,
    `Video content: "${input.topic}"
Hook angle: "${input.hook || "product showcase"}"
Platform: ${input.platform}
Language: ${L(input.language)}

Write a punchy Reel/Story caption:
- First line = the hook (make them want to watch)
- 1-2 lines of context or intrigue
- CTA (follow, comment, DM, or link in bio)
- 3-5 trending hashtags
- Under 50 words total
- Energy matches Myanmar viral seller/creator style

Output the caption only.`
  )
}

export async function generateSeasonal(input: {
  festival: string; product: string; offer: string; language: "mm" | "en"
}): Promise<string> {
  return ask(
    `You are a Myanmar cultural marketing expert who creates festival promotional posts that feel genuinely celebratory — not just a sale announcement. You weave cultural sentiment with commercial messaging in a way that resonates deeply with Myanmar buyers.`,
    `Festival/Occasion: "${input.festival}"
Product: "${input.product}"
Special offer/message: "${input.offer}"
Language: ${L(input.language)}

Write a festival promotional post:
- Genuine festival greeting (culturally appropriate for Myanmar)
- Smooth transition to product/offer
- The deal clearly stated
- Warm celebratory CTA
- Seasonal and product hashtags
- Under 150 words
- Feel: heartfelt + exciting, not just a sales pitch

Output the post only.`
  )
}
