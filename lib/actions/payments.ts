
"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const verifyCheckoutPayment = async (sessionId: string) => {
  if (!sessionId) {
    throw new Error("Checkout session ID is required")
  }

  // Get logged-in user through Better Auth
  const userSession = await auth.api.getSession({
    headers: await headers(),
  })

  if (!userSession?.user) {
    throw new Error("Please login to verify your payment")
  }

  // Call Express backend
  const response = await fetch(
    `${BASE_URL}/payments/checkout-verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        userId: userSession.user.id,
      }),
      cache: "no-store",
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(
      result.message || result.error || "Payment verification failed"
    )
  }

  return result
}
