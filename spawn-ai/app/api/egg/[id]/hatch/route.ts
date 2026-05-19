import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const { name } = await req.json()
  const egg = await prisma.egg.findFirst({ where: { id, userId: session.user.id, isHatched: false } })
  if (!egg) return NextResponse.json({ error: "Egg not found" }, { status: 404 })
  if (new Date() < new Date(egg.hatchesAt)) return NextResponse.json({ error: "Not ready yet" }, { status: 400 })

  const seeds = await prisma.personalitySeed.findMany({ where: { eggId: egg.id } })
  const seedText = seeds.map(s => s.message).join(" ")
  const personality = {
    cheerful: seedText.match(/happy|joy|love|fun|yay/gi)?.length ? 0.8 : 0.5,
    curious: seedText.match(/why|what|how|wonder|curious/gi)?.length ? 0.8 : 0.5,
    playful: seedText.match(/play|game|fun|silly|laugh/gi)?.length ? 0.8 : 0.5,
    affectionate: seedText.match(/love|hug|cuddle|miss|care/gi)?.length ? 0.8 : 0.5,
  }
  const backstory = `A ${egg.tier} ${egg.species} hatched with ${seeds.length} whispered memories.`

  const pet = await prisma.pet.create({
    data: { userId: session.user.id, name: name || egg.species, species: egg.species,
      tier: egg.tier, personality: JSON.stringify(personality), backstory }
  })
  await prisma.egg.update({ where: { id: egg.id }, data: { isHatched: true } })
  return NextResponse.json({ pet })
}
