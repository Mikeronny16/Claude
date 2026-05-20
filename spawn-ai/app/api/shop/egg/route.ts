import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getRequestUser } from "@/lib/mobile-auth"

const EGG_PRICES: Record<string, { amount: number; species: string; tier: string }> = {
  common:  { amount: 0,  species: "cat",     tier: "common" },
  rare:    { amount: 3,  species: "dragon",  tier: "rare"   },
  epic:    { amount: 7,  species: "phoenix", tier: "epic"   },
  mythic:  { amount: 15, species: "unicorn", tier: "mythic" },
}

export async function POST(req: Request) {
  const user = await getRequestUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { tier } = await req.json()
  const egg = EGG_PRICES[tier]
  if (!egg) return NextResponse.json({ error: "Invalid tier" }, { status: 400 })

  if (tier === "common") {
    const existing = await prisma.egg.findFirst({ where: { userId: user.id, tier: "common" } })
    if (existing) return NextResponse.json({ error: "Already have a common egg" }, { status: 400 })
    const hatchesAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
    const newEgg = await prisma.egg.create({ data: { userId: user.id, species: egg.species, tier: egg.tier, hatchesAt } })
    return NextResponse.json({ egg: newEgg })
  }

  const existing = await prisma.paymentRequest.findFirst({
    where: { userId: user.id, plan: `egg_${tier}`, status: "pending" },
  })
  if (existing) return NextResponse.json({ error: "Already requested" }, { status: 400 })

  await prisma.paymentRequest.create({
    data: { userId: user.id, plan: `egg_${tier}`, amount: egg.amount },
  })

  return NextResponse.json({ success: true, requiresPayment: true })
}
