import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const [requests, users] = await Promise.all([
    prisma.paymentRequest.findMany({
      include: { user: { select: { email: true, name: true, plan: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      select: { id: true, email: true, name: true, plan: true, isAdmin: true, createdAt: true, messagesUsedToday: true },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return NextResponse.json({ requests, users })
}
