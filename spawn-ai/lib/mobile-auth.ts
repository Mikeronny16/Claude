import { jwtVerify } from "jose"
import { auth } from "./auth"

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "fallback-secret")

type MobileUser = { id: string; email: string; isAdmin: boolean; plan: string }

export async function getRequestUser(req: Request): Promise<MobileUser | null> {
  // Try cookie session first (web)
  const session = await auth()
  if (session?.user?.id) {
    return {
      id: session.user.id,
      email: session.user.email ?? "",
      isAdmin: session.user.isAdmin ?? false,
      plan: session.user.plan ?? "free",
    }
  }

  // Try mobile Bearer/x-mobile-token header
  const token = req.headers.get("x-mobile-token") ?? req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secret)
    return {
      id: payload.id as string,
      email: payload.email as string,
      isAdmin: (payload.isAdmin as boolean) ?? false,
      plan: (payload.plan as string) ?? "free",
    }
  } catch {
    return null
  }
}
