import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getModel, buildPetSystemPrompt } from "@/lib/gemini"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { message } = await req.json()

  const pet = await prisma.pet.findFirst({ where: { id, userId: session.user.id } })
  if (!pet) return NextResponse.json({ error: "Pet not found" }, { status: 404 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  // Check daily message limit
  const today = new Date(); today.setHours(0,0,0,0)
  if (new Date(user.lastMessageReset) < today) {
    await prisma.user.update({ where: { id: user.id }, data: { messagesUsedToday: 0, lastMessageReset: new Date() } })
    user.messagesUsedToday = 0
  }
  const limit = user.plan === "free" ? 30 : 999
  if (user.messagesUsedToday >= limit) {
    return NextResponse.json({ error: "Daily message limit reached" }, { status: 429 })
  }

  // Get recent messages for context
  const history = await prisma.petMessage.findMany({
    where: { petId: pet.id }, orderBy: { createdAt: "asc" }, take: 20
  })

  const systemPrompt = buildPetSystemPrompt(
    { name: pet.name, species: pet.species, tier: pet.tier, stage: pet.stage,
      level: pet.level, personality: pet.personality, backstory: pet.backstory,
      hunger: pet.hunger, energy: pet.energy, happiness: pet.happiness, bond: pet.bond },
    user.name ?? user.email
  )

  const model = getModel(user.plan)
  const chat = model.startChat({
    systemInstruction: systemPrompt,
    history: history.map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }))
  })

  const result = await chat.sendMessage(message)
  const reply = result.response.text()

  // Save messages
  await prisma.petMessage.createMany({
    data: [
      { petId: pet.id, role: "user", content: message },
      { petId: pet.id, role: "pet", content: reply, xpGained: 5 }
    ]
  })

  // Update pet stats & XP
  const newXp = pet.xp + 5
  const newLevel = Math.floor(newXp / 100) + 1
  const newStage = newLevel >= 51 ? "adult" : newLevel >= 26 ? "teen" : newLevel >= 11 ? "child" : "baby"
  const newBond = Math.min(100, pet.bond + 1)
  const newHappiness = Math.min(100, pet.happiness + 3)

  await prisma.pet.update({
    where: { id: pet.id },
    data: { xp: newXp, level: newLevel, stage: newStage, bond: newBond, happiness: newHappiness, lastInteractedAt: new Date() }
  })
  await prisma.user.update({ where: { id: user.id }, data: { messagesUsedToday: { increment: 1 } } })

  return NextResponse.json({ reply, xpGained: 5, newLevel, newStage })
}
