// Myanmar Unicode/Zawgyi detection and conversion
// Uses heuristic approach since myanmar-tools has no TS types in browser

const ZAWGYI_PATTERN = /[ၠ-႗]/

export function detectEncoding(text: string): "zawgyi" | "unicode" {
  return ZAWGYI_PATTERN.test(text) ? "zawgyi" : "unicode"
}

// Basic Zawgyi → Unicode conversion mapping for common characters
const ZAWGYI_TO_UNICODE: Record<string, string> = {
  "ၠ": "ၠ",
  "ၡ": "ၡ",
  "ၢ": "င်္",
  "ၣ": "ဃင်္",
  "ၤ": "င်္",
}

export function zawgyiToUnicode(text: string): string {
  if (detectEncoding(text) === "unicode") return text
  let result = text
  for (const [zawgyi, unicode] of Object.entries(ZAWGYI_TO_UNICODE)) {
    result = result.split(zawgyi).join(unicode)
  }
  return result
}

export function normalizeMyanmar(text: string): string {
  return zawgyiToUnicode(text)
}

export const MM_UI = {
  captionTool: "Caption Generator",
  replyTool: "Reply Helper",
  descTool: "Product Description",
  generate: "Generate လုပ်မည်",
  generating: "Generating...",
  copy: "Copy",
  copied: "Copied!",
  credits: "Credits",
  daily: "Daily Free",
  tryFree: "အခမဲ့ စမ်းကြည့်ပါ",
  getMore: "Credits ပိုရမည်",
  perDay: "/ day free",
  signupBonus: "Signup bonus: +10 credits",
}
