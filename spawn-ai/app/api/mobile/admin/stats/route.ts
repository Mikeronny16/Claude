import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getRequestUser } from "@/lib/mobile-auth"

export async function GET(req: Request) {
  const user = await getRequestUser(req)
  if (!user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const today = new Date(); today.setHours(0, 0, 0, 0)

  const [
    totalUsers, newUsersToday,
    totalPets, totalEggs,
    totalMessages, messagesToday,
    pendingRequests,
    planCounts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.pet.count(),
    prisma.egg.count(),
    prisma.petMessage.count(),
    prisma.petMessage.count({ where: { createdAt: { gte: today } } }),
    prisma.paymentRequest.count({ where: { status: "pending" } }),
    prisma.user.groupBy({ by: ["plan"], _count: { id: true } }),
  ])

  return NextResponse.json({
    totalUsers, newUsersToday,
    totalPets, totalEggs,
    totalMessages, messagesToday,
    pendingRequests,
    planCounts: planCounts.map(p => ({ plan: p.plan, count: p._count.id })),
  })
}
