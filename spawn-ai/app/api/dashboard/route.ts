import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [eggs, pets, user] = await Promise.all([
    prisma.egg.findMany({
      where: { userId: session.user.id },
      include: { personalitySeeds: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.pet.findMany({
      where: { userId: session.user.id },
      orderBy: { lastInteractedAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, messagesUsedToday: true, name: true, email: true },
    }),
  ])

  return NextResponse.json({ eggs, pets, user })
}
