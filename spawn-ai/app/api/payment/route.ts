import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { plan, amount } = await req.json()

  // Check if already has pending request for this plan
  const existing = await prisma.paymentRequest.findFirst({
    where: { userId: session.user.id, plan, status: "pending" },
  })
  if (existing) return NextResponse.json({ error: "Already requested" }, { status: 400 })

  await prisma.paymentRequest.create({
    data: { userId: session.user.id, plan, amount },
  })

  return NextResponse.json({ success: true })
}
