import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "fallback-secret")

export async function POST(req: Request) {
  const { email, password, name } = await req.json()
  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })

  const existing = await prisma.user.findUnique({ where: { email: email as string } })
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 })

  const hashedPassword = await bcrypt.hash(password as string, 12)
  const user = await prisma.user.create({
    data: { email: email as string, hashedPassword, name: name ?? null, plan: "free" },
  })

  // Give 1 free common egg
  await prisma.egg.create({
    data: {
      userId: user.id, species: "cat", tier: "common",
      hatchesAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  })

  const token = await new SignJWT({ id: user.id, email: user.email, isAdmin: false, plan: "free" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret)

  return NextResponse.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, plan: "free", isAdmin: false },
  })
}
