import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { email, password, name } = await req.json()
  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 })
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 400 })
  const hashedPassword = await bcrypt.hash(password, 12)
  const isAdmin = email === process.env.ADMIN_EMAIL
  const user = await prisma.user.create({ data: { email, name, hashedPassword, isAdmin } })
  // Give 1 free egg
  const hatchesAt = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours for demo
  await prisma.egg.create({ data: { userId: user.id, species: "cat", tier: "common", hatchesAt } })
  return NextResponse.json({ success: true })
}
