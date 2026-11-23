import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold text-red-600">
        Payment Cancelled
      </h1>

      <p className="mt-4 text-gray-600">
        Your payment was cancelled. No payment has been processed.
      </p>

      <Link
        href="/dashboard/vendor/subscription"
        className="mt-6 rounded-lg bg-black px-6 py-3 text-white"
      >
        Back to Subscription
      </Link>
    </div>
  );
}