import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const planEggs: Record<string, { species: string; tier: string; count: number }> = {
  pro:       { species: "dragon",   tier: "rare",   count: 2 },
  ultra:     { species: "phoenix",  tier: "epic",   count: 3 },
  legendary: { species: "unicorn",  tier: "mythic", count: 5 },
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
    const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const eggConfig = planEggs[request.plan]

    await prisma.paymentRequest.update({
      where: { id },
      data: { status: "approved", adminNote: note, approvedAt: new Date() },
    })
    await prisma.user.update({
      where: { id: request.userId },
      data: { plan: request.plan, planExpiresAt },
    })

    // Give bonus eggs based on plan
    if (eggConfig) {
      const hatchesAt = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2hr incubation
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
    await prisma.paymentRequest.update({
      where: { id },
      data: { status: "rejected", adminNote: note },
    })
  }

  return NextResponse.json({ success: true })
}
