import { NextRequest, NextResponse } from "next/server"

// Credits are managed client-side via localStorage:
//   aura_credits   — number of paid credits remaining
//   aura_free_used — boolean, whether the free look has been used

// GET — informational endpoint
export async function GET() {
  return NextResponse.json({ message: "credits managed client-side" })
}

// POST — validate an unlock code
// Body: { code: string }
// Valid format: AURA-XXXX (where XXXX is 1+ alphanumeric characters)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { code?: string }
    const code = (body.code ?? "").trim().toUpperCase()

    const isValid = /^AURA-[A-Z0-9]+$/.test(code)

    if (isValid) {
      return NextResponse.json({ valid: true, credits: 10 })
    }

    return NextResponse.json({ valid: false }, { status: 400 })
  } catch (err) {
    console.error("Credits POST error:", (err as Error).message)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
