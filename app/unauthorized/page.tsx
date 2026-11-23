
import Link from "next/link"
import { ShieldAlert, Home, ArrowLeft, LockKeyhole } from "lucide-react"

const UnAuthorizedUsersPage = () => {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#fff8f2] px-4 py-16">
      <div className="w-full max-w-lg text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-[#fcebdc]">
          <ShieldAlert
            className="size-10 text-[#9b762c]"
            strokeWidth={1.5}
          />
        </div>

        {/* Error Code */}
        <h1 className="font-serif text-8xl font-bold tracking-tight text-[#421d0d] sm:text-9xl">
          403
        </h1>

        <p className="mt-3 text-xs font-bold tracking-[0.2em] text-[#9b762c] uppercase">
          Access Restricted
        </p>

        <h2 className="mt-4 font-serif text-2xl font-bold text-[#421d0d] sm:text-3xl">
          You Shall Not Pass!
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#78675d]">
          Sorry, you don&apos;t have permission to access this page.
          Please make sure you are logged in with an authorized account.
        </p>

        {/* Access Info */}
        <div className="mx-auto mt-6 flex max-w-sm items-center gap-3 rounded-xl border border-[#ead9ca] bg-white p-4 text-left">
          <LockKeyhole className="size-5 shrink-0 text-[#9b762c]" />

          <p className="text-xs leading-relaxed text-[#78675d]">
            This area is restricted to authorized users only.
            Contact the administrator if you believe this is a mistake.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#421d0d] px-6 text-sm font-semibold text-white transition hover:bg-[#5a321c]"
          >
            <Home className="size-4" />
            Back to Home
          </Link>
        </div>

        <p className="mt-10 text-xs text-[#a18c7c]">
          © PizzaHub — Freshly Made, Happily Served.
        </p>
      </div>
    </main>
  )
}

export default UnAuthorizedUsersPage
