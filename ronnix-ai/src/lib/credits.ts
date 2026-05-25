export const PLANS = {
  free: { name: "Free", daily: 3, credits: 0 },
  starter: { name: "Starter", daily: Infinity, credits: 500 },
  pro: { name: "Pro", daily: Infinity, credits: 1500 },
} as const

export const CREDIT_PACKS = [
  { id: "pack_500", credits: 500, price_mmk: 3900, label: "500 Credits", popular: false },
  { id: "pack_1500", credits: 1500, price_mmk: 9900, label: "1,500 Credits", popular: true },
] as const

export const TOOL_COST = {
  caption: 1,
  reply: 1,
  description: 1,
} as const

export const FREE_DAILY_LIMIT = 3
export const SIGNUP_BONUS = 10
export const REFERRAL_BONUS = 10
