import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const planEggs: Record<string, { species: string; tier: string; count: number }> = {
  pro:        { species: "dragon",  tier: "rare",   count: 2 },
  ultra:      { species: "phoenix", tier: "epic",   count: 3 },
  legendary:  { species: "unicorn", tier: "mythic", count: 5 },
  egg_rare:   { species: "dragon",  tier: "rare",   count: 1 },
  egg_epic:   { species: "phoenix", tier: "epic",   count: 1 },
  egg_mythic: { species: "unicorn", tier: "mythic", count: 1 },
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const admin = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!admin?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const { action, note } = await req.json()

  const request = await prisma.paymentRequest.findUnique({ where: { id } })
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (action === "approve") {
    const eggConfig = planEggs[request.plan]
    const isEggPurchase = request.plan.startsWith("egg_")

    await prisma.paymentRequest.update({
      where: { id },
      data: { status: "approved", adminNote: note, approvedAt: new Date() },
    })

    if (isEggPurchase) {
      // Egg purchase: give the egg, don't change plan
      if (eggConfig) {
        const hatchesAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
        await prisma.egg.createMany({
          data: Array.from({ length: eggConfig.count }, () => ({
            userId: request.userId,
            species: eggConfig.species,
            tier: eggConfig.tier,
            hatchesAt,
          })),
        })
      }
    } else {
      // Plan upgrade: update plan + give bonus eggs
      const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      await prisma.user.update({
        where: { id: request.userId },
        data: { plan: request.plan, planExpiresAt },
      })
      if (eggConfig) {
        const hatchesAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
        await prisma.egg.createMany({
          data: Array.from({ length: eggConfig.count }, () => ({
            userId: request.userId,
            species: eggConfig.species,
            tier: eggConfig.tier,
            hatchesAt,
          })),
        })
      }
    }
  } else {
    await prisma.paymentRequest.update({
      where: { id },
      data: { status: "rejected", adminNote: note },
    })
  }

  return NextResponse.json({ success: true })
}
