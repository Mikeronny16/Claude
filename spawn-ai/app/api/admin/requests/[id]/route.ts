import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const admin = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!admin?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const { action, note } = await req.json()

  const request = await prisma.paymentRequest.findUnique({ where: { id } })
  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (action === "approve") {
    const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await Promise.all([
      prisma.paymentRequest.update({
        where: { id },
        data: { status: "approved", adminNote: note, approvedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: request.userId },
        data: { plan: request.plan, planExpiresAt },
      }),
    ])
  } else {
    await prisma.paymentRequest.update({
      where: { id },
      data: { status: "rejected", adminNote: note },
    })
  }

  return NextResponse.json({ success: true })
}
