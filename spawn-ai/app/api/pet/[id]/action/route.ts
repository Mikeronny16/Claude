import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const { action } = await req.json()
  const pet = await prisma.pet.findFirst({ where: { id, userId: session.user.id } })
  if (!pet) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const actionMap: Record<string, Record<string, number>> = {
    feed:  { hunger: Math.min(100, pet.hunger + 30), happiness: Math.min(100, pet.happiness + 5) },
    play:  { happiness: Math.min(100, pet.happiness + 20), energy: Math.max(0, pet.energy - 15), bond: Math.min(100, pet.bond + 3) },
    sleep: { energy: Math.min(100, pet.energy + 40), hunger: Math.max(0, pet.hunger - 10) },
    pet:   { happiness: Math.min(100, pet.happiness + 10), bond: Math.min(100, pet.bond + 2) },
  }
  const updates = actionMap[action] ?? {}

  const updated = await prisma.pet.update({ where: { id: pet.id }, data: { ...updates, lastInteractedAt: new Date() } })
  return NextResponse.json({ pet: updated })
}
