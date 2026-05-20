import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getRequestUser } from "@/lib/mobile-auth"

export async function GET(req: Request) {
  const user = await getRequestUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [eggs, pets, dbUser] = await Promise.all([
    prisma.egg.findMany({
      where: { userId: user.id },
      include: { personalitySeeds: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.pet.findMany({
      where: { userId: user.id },
      orderBy: { lastInteractedAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { plan: true, messagesUsedToday: true, name: true, email: true, isAdmin: true },
    }),
  ])

  return NextResponse.json({ eggs, pets, user: dbUser })
}
