import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "fallback-secret")

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: email as string } })
  if (!user || !user.hashedPassword) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })

  const valid = await bcrypt.compare(password as string, user.hashedPassword)
  if (!valid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })

  const isAdmin = user.email === process.env.ADMIN_EMAIL ? true : user.isAdmin

  const token = await new SignJWT({ id: user.id, email: user.email, isAdmin, plan: user.plan })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret)

  return NextResponse.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, plan: user.plan, isAdmin },
  })
}
