import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Decrease all pet stats gradually
  const pets = await prisma.pet.findMany({ select: { id: true, hunger: true, energy: true, happiness: true, lastInteractedAt: true } })

  const updates = pets.map(pet => {
    const hoursSince = (Date.now() - new Date(pet.lastInteractedAt).getTime()) / 3600000
    const decay = Math.min(Math.floor(hoursSince), 8) // max 8hrs decay at once

    return prisma.pet.update({
      where: { id: pet.id },
      data: {
        hunger:    Math.max(0, pet.hunger - decay * 4),
        energy:    Math.max(0, pet.energy - decay * 2),
        happiness: Math.max(0, pet.happiness - decay * 3),
      },
    })
  })

  await Promise.all(updates)
  return NextResponse.json({ ok: true, updated: pets.length })
}
