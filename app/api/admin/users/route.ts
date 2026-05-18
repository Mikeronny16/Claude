import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true } });
  if (adminUser?.email !== process.env.ADMIN_EMAIL) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, plan: true, credits: true, planExpiresAt: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true } });
  if (adminUser?.email !== process.env.ADMIN_EMAIL) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, plan, credits } = await req.json();
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { plan, credits },
    select: { id: true, email: true, plan: true, credits: true },
  });

  return NextResponse.json(updated);
}
