import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const [pet, messages] = await Promise.all([
    prisma.pet.findFirst({ where: { id, userId: session.user.id } }),
    prisma.petMessage.findMany({
      where: { petId: id },
      orderBy: { createdAt: "asc" },
      take: 60,
    }),
  ])

  if (!pet) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ pet, messages })
}
