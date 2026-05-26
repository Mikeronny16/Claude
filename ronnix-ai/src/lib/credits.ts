export const PLANS = {
  free:    { name: "Free",    daily: 3,        credits: 0 },
  starter: { name: "Starter", daily: Infinity, credits: 200 },
  pro:     { name: "Pro",     daily: Infinity, credits: 500 },
  max:     { name: "Max",     daily: Infinity, credits: 1000 },
} as const

export const CREDIT_PACKS = [
  { id: "starter", credits: 200,  price_mmk: 10000, label: "Starter — 200 Credits",  popular: false, plan_to_set: "starter" },
  { id: "pro",     credits: 500,  price_mmk: 30000, label: "Pro — 500 Credits",       popular: true,  plan_to_set: "pro"     },
  { id: "max",     credits: 1000, price_mmk: 50000, label: "Max — 1,000 Credits",     popular: false, plan_to_set: "max"     },
] as const

export const TOOL_COST = {
  caption:     2,
  reply:       2,
  hashtags:    2,
  reel:        3,
  promo:       5,
  testimonial: 4,
  comparison:  5,
  seasonal:    5,
  description: 8,
  variants:    12,
  live:        20,
} as const

// Tools free users can access
export const FREE_TOOLS = ["caption", "reply", "hashtags", "reel", "promo"] as const
export type FreeTool = typeof FREE_TOOLS[number]

export const FREE_DAILY_LIMIT = 3
export const SIGNUP_BONUS = 10
export const REFERRAL_BONUS = 10
