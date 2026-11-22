
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export async function GET() {
  try {
    const userSession = await auth.api.getSession({
      headers: await headers(),
    })

    if (!userSession?.user) {
      return NextResponse.json(
        { error: "Please login first" },
        { status: 401 }
      )
    }

    const res = await fetch(
      `${BASE_URL}/users/${userSession.user.id}`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: "Unable to check subscription" },
        { status: 500 }
      )
    }

    const data = await res.json()

    return NextResponse.json({
      premium: data.premium === true,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Subscription check failed" },
      { status: 500 }
    )
  }
}
