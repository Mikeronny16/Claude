import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getRequestUser } from "@/lib/mobile-auth"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getRequestUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const pet = await prisma.pet.findFirst({ where: { id, userId: user.id } })
  if (!pet) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const messages = await prisma.petMessage.findMany({
    where: { petId: id },
    orderBy: { createdAt: "asc" },
    take: 60,
    select: { id: true, role: true, content: true, createdAt: true },
  })

  return NextResponse.json({ messages })
}
