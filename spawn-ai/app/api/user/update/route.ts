import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getRequestUser } from "@/lib/mobile-auth"

export async function POST(req: Request) {
  const authUser = await getRequestUser(req)
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name, currentPassword, newPassword } = await req.json()
  const user = await prisma.user.findUnique({ where: { id: authUser.id } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const data: { name?: string | null; hashedPassword?: string } = {}
  if (name !== undefined) data.name = name.trim() || null
  if (newPassword) {
    if (!currentPassword) return NextResponse.json({ error: "Current password required" }, { status: 400 })
    const valid = await bcrypt.compare(currentPassword, user.hashedPassword ?? "")
    if (!valid) return NextResponse.json({ error: "Current password incorrect" }, { status: 400 })
    data.hashedPassword = await bcrypt.hash(newPassword, 12)
  }

  await prisma.user.update({ where: { id: user.id }, data })
  return NextResponse.json({ success: true })
}
