import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PLAN_PRICES: Record<string, number> = { pro: 9, business: 29 };

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json();
  if (!["pro", "business"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const request = await prisma.paymentRequest.create({
    data: {
      userId: session.user.id,
      plan,
      amount: PLAN_PRICES[plan],
      status: "pending",
    },
  });

  return NextResponse.json({ success: true, requestId: request.id });
}
