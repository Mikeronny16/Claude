import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const EGG_PRICES: Record<string, { amount: number; species: string; tier: string }> = {
  common:  { amount: 0,  species: "cat",     tier: "common" },
  rare:    { amount: 3,  species: "dragon",  tier: "rare"   },
  epic:    { amount: 7,  species: "phoenix", tier: "epic"   },
  mythic:  { amount: 15, species: "unicorn", tier: "mythic" },
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { tier } = await req.json()
  const egg = EGG_PRICES[tier]
  if (!egg) return NextResponse.json({ error: "Invalid tier" }, { status: 400 })

  // Free common egg — give directly if none yet
  if (tier === "common") {
    const existing = await prisma.egg.findFirst({ where: { userId: session.user.id, tier: "common" } })
    if (existing) return NextResponse.json({ error: "Already have a common egg" }, { status: 400 })
    const hatchesAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
    const newEgg = await prisma.egg.create({ data: { userId: session.user.id, species: egg.species, tier: egg.tier, hatchesAt } })
    return NextResponse.json({ egg: newEgg })
  }

  // Paid eggs — create payment request
  const existing = await prisma.paymentRequest.findFirst({
    where: { userId: session.user.id, plan: `egg_${tier}`, status: "pending" },
  })
  if (existing) return NextResponse.json({ error: "Already requested" }, { status: 400 })

  await prisma.paymentRequest.create({
    data: { userId: session.user.id, plan: `egg_${tier}`, amount: egg.amount },
  })

  return NextResponse.json({ success: true, requiresPayment: true })
}
