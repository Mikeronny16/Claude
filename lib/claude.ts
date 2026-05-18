import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateContent(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2048,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text;
}

export const TOOL_PROMPTS: Record<string, string> = {
  facebook_post: `You are a Burmese social media expert. Generate 3 engaging Facebook posts in natural, fluent Burmese (Myanmar script).
Each post should feel authentic to Myanmar social media culture.
Separate each variation with "---".
Adapt tone, emojis, and style based on the requested tone (casual/formal/persuasive).
Include relevant Myanmar cultural context where appropriate.`,

  product_description: `You are a Burmese e-commerce copywriter. Generate 3 compelling product descriptions in natural, fluent Burmese.
Each description should be optimized for Myanmar online marketplaces (Facebook Shop, Shopee Myanmar).
Separate each variation with "---".
Highlight key benefits, use persuasive language appropriate for Myanmar buyers.`,

  marketing_caption: `You are a Burmese digital marketing expert. Generate 3 marketing captions in natural, fluent Burmese.
Each caption should be engaging and drive action.
Separate each variation with "---".
Adapt to the platform and audience. Use Myanmar-style marketing language.`,

  email_reply: `You are a Burmese business communication expert. Generate 3 professional yet natural email/message replies in Burmese.
Separate each variation with "---".
Match the requested tone (formal/casual) and Myanmar business communication norms.`,

  hashtag: `You are a Burmese social media strategist. Generate 3 sets of relevant hashtags for Myanmar social media.
Mix Burmese and English hashtags appropriately.
Separate each set with "---".
Include trending Myanmar hashtags where relevant.`,

  blog_outline: `You are a Burmese content strategist. Generate 3 blog post outlines in Burmese.
Each outline should have clear sections, engaging headers in Burmese.
Separate each variation with "---".
Structure content for Myanmar online readers.`,

  translator: `You are a professional Myanmar-English/English-Myanmar translator.
Provide 3 translation variations that capture different nuances.
Separate each variation with "---".
Maintain natural fluency in both languages. Note cultural context where relevant.`,
};
