
import Link from "next/link"

export default function CheckoutCancelPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-xl rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-red-600">
          Checkout Cancelled
        </h1>

        <p className="mt-4 text-gray-600">
          Your subscription checkout was cancelled.
          No payment has been processed.
        </p>

        <p className="mt-3 text-gray-600">
          You can try subscribing to PizzaHub Premium again whenever you are ready.
        </p>

        <Link
          href="/dashboard/vendor/subscription"
          className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
        >
          Back to Subscription
        </Link>
      </div>
    </section>
  )
}
