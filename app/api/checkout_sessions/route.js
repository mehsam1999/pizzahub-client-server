import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export async function POST() {
  try {
    const headersList = await headers()

    const userSession = await auth.api.getSession({
      headers: headersList,
    })

    if (!userSession?.user) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 })
    }

    const user = userSession.user

    // Check whether the user is already Premium
    const userRes = await fetch(`${BASE_URL}/users/${user.id}`, {
      cache: "no-store",
    })

    if (!userRes.ok) {
      throw new Error("Unable to verify user subscription")
    }

    const userData = await userRes.json()

    if (userData.premium === true) {
      return NextResponse.json(
        {
          code: "ALREADY_PREMIUM",
          message: "You are already a Premium user.",
        },
        { status: 409 }
      )
    }

    const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL

    if (!origin) {
      throw new Error("Application URL not found")
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PREMIUM_PRICE_ID,
          quantity: 1,
        },
      ],

      mode: "subscription",

      customer_email: user.email,

      client_reference_id: user.id,

      metadata: {
        userId: user.id,
      },

      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },

      success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${origin}/dashboard/vendor/subscription?canceled=true`,
    })

    return NextResponse.json({
      url: session.url,
    })
  } catch (err) {
    console.error("Stripe Checkout Error:", err)

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Unable to create checkout session",
      },
      { status: 500 }
    )
  }
}
