import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const { message } = await req.json()
  const egg = await prisma.egg.findFirst({ where: { id, userId: session.user.id, isHatched: false } })
  if (!egg) return NextResponse.json({ error: "Egg not found" }, { status: 404 })
  await prisma.personalitySeed.create({ data: { eggId: egg.id, message } })
  const reactions = ["*the egg wobbles slightly*","*a faint glow pulses*","*the egg shivers with warmth*","*tiny cracks of light appear*","*it hums softly*"]
  return NextResponse.json({ reaction: reactions[Math.floor(Math.random() * reactions.length)] })
}
