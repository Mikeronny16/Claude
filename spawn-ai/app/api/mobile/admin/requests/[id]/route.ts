import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getRequestUser } from "@/lib/mobile-auth"

const planEggs: Record<string, { species: string; tier: string; count: number }> = {
  pro:        { species: "dragon",  tier: "rare",   count: 2 },
  ultra:      { species: "phoenix", tier: "epic",   count: 3 },
  legendary:  { species: "unicorn", tier: "mythic", count: 5 },
  egg_rare:   { species: "dragon",  tier: "rare",   count: 1 },
  egg_epic:   { species: "phoenix", tier: "epic",   count: 1 },
  egg_mythic: { species: "unicorn", tier: "mythic", count: 1 },
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getRequestUser(req)
  if (!user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const { action } = await req.json()

  const request = await prisma.paymentRequest.findUnique({ where: { id } })
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (action === "approve") {
    const eggConfig = planEggs[request.plan]
    const isEggPurchase = request.plan.startsWith("egg_")

    await prisma.paymentRequest.update({
      where: { id },
      data: { status: "approved", approvedAt: new Date() },
    })

    if (isEggPurchase) {
      if (eggConfig) {
        const hatchesAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
        await prisma.egg.createMany({
          data: Array.from({ length: eggConfig.count }, () => ({
            userId: request.userId, species: eggConfig.species, tier: eggConfig.tier, hatchesAt,
          })),
        })
      }
    } else {
      const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      await prisma.user.update({
        where: { id: request.userId },
        data: { plan: request.plan, planExpiresAt },
      })
      if (eggConfig) {
        const hatchesAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
        await prisma.egg.createMany({
          data: Array.from({ length: eggConfig.count }, () => ({
            userId: request.userId, species: eggConfig.species, tier: eggConfig.tier, hatchesAt,
          })),
        })
      }
    }
  } else {
    await prisma.paymentRequest.update({
      where: { id },
      data: { status: "rejected" },
    })
  }

  return NextResponse.json({ success: true })
}
