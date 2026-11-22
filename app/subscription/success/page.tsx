
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { verifyCheckoutPayment } from "@/lib/actions/payments"

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string
  }>
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error("Please provide a valid session_id")
  }

  const userSession = await auth.api.getSession({
    headers: await headers(),
  })

  if (!userSession?.user) {
    redirect("/login")
  }

  const result = await verifyCheckoutPayment(session_id)

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-xl rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-green-600">
          Checkout Successful!
        </h1>

        <p className="mt-4 text-gray-600">
          Thank you for subscribing to PizzaHub Premium.
        </p>

        <p className="mt-3 text-gray-600">
          Confirmation email:{" "}
          <strong>
            {result.customer_email || userSession.user.email}
          </strong>
        </p>

        <p className="mt-4 font-semibold text-green-600">
          {result.message}
        </p>
      </div>
    </section>
  )
}
