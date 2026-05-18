import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  return user?.email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await prisma.paymentRequest.findMany({
    include: { user: { select: { email: true, name: true, plan: true, credits: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !(await isAdmin(session.user.id))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { requestId, action, adminNote } = await req.json();

  const request = await prisma.paymentRequest.findUnique({
    where: { id: requestId },
    include: { user: true },
  });

  if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "approve") {
    const credits = request.plan === "pro" ? 500 : 9999;
    const planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: request.userId },
        data: { plan: request.plan, credits, planExpiresAt },
      }),
      prisma.paymentRequest.update({
        where: { id: requestId },
        data: { status: "approved", adminNote, approvedAt: new Date() },
      }),
    ]);
  } else {
    await prisma.paymentRequest.update({
      where: { id: requestId },
      data: { status: "rejected", adminNote },
    });
  }

  return NextResponse.json({ success: true });
}
