import Anthropic from "@anthropic-ai/sdk"

export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface DocumentAnalysis {
  doc_type: string
  doc_type_mm: string
  summary: string
  summary_mm: string
  red_flags: Array<{
    severity: "high" | "medium" | "low"
    text: string
    text_mm: string
  }>
  action_items: Array<{
    text: string
    text_mm: string
    deadline?: string
  }>
  key_terms: Array<{
    term: string
    meaning: string
    meaning_mm: string
  }>
  overall_risk: "high" | "medium" | "low" | "none"
}

const SYSTEM = `You are Klaro, an expert document analyst. Your job is to read documents and explain them clearly to ordinary people.

Always respond with valid JSON matching the exact schema provided. Be accurate, clear, and helpful.

For Myanmar (Burmese) translations: write in natural, everyday Burmese — not formal or translated-sounding. Use Unicode (not Zawgyi).

For red flags: identify genuinely important risks, unusual clauses, hidden fees, tight deadlines, or terms that could harm the reader.

For action items: list concrete things the reader must do, with any deadlines extracted from the document.

Disclaimer: remind readers this is for understanding only, not legal or medical advice.`

export async function analyzeDocument(
  imageBase64: string,
  mediaType: string,
  lang: "en" | "mm"
): Promise<DocumentAnalysis> {
  const userPrompt = `Analyze this document carefully. Return ONLY a JSON object with this exact structure:

{
  "doc_type": "document type in English (e.g. Rental Agreement, Medical Prescription)",
  "doc_type_mm": "document type in Myanmar Unicode",
  "summary": "2-3 sentence plain English explanation of what this document is and what it means for the reader",
  "summary_mm": "2-3 sentence plain Myanmar Unicode explanation",
  "red_flags": [
    {
      "severity": "high|medium|low",
      "text": "specific red flag in English — be concrete about what the risk is",
      "text_mm": "same red flag in Myanmar Unicode"
    }
  ],
  "action_items": [
    {
      "text": "specific action the reader must take",
      "text_mm": "same action in Myanmar Unicode",
      "deadline": "deadline if mentioned in the document, or null"
    }
  ],
  "key_terms": [
    {
      "term": "confusing term from the document",
      "meaning": "plain English meaning",
      "meaning_mm": "Myanmar Unicode meaning"
    }
  ],
  "overall_risk": "high|medium|low|none"
}

Rules:
- red_flags: 0-5 items, only genuine risks (not obvious normal terms)
- action_items: 1-6 items, ordered by urgency
- key_terms: 2-5 most confusing terms from the document
- overall_risk: "high" if signing/acting could seriously harm the reader, "medium" if there are notable concerns, "low" if mostly standard, "none" if benign
- If text is in Zawgyi encoding, convert to Unicode in your response
- Return ONLY the JSON object, no markdown fences`

  const response = await claude.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
              data: imageBase64,
            },
          },
          { type: "text", text: userPrompt },
        ],
      },
    ],
  })

  const raw = response.content[0].type === "text" ? response.content[0].text : ""
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new Error("Invalid AI response format")

  return JSON.parse(match[0]) as DocumentAnalysis
}
