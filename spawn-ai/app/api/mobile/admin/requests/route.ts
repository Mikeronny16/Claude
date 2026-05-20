import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getRequestUser } from "@/lib/mobile-auth"

export async function GET(req: Request) {
  const user = await getRequestUser(req)
  if (!user?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const requests = await prisma.paymentRequest.findMany({
    include: { user: { select: { email: true, name: true, plan: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return NextResponse.json({ requests })
}
