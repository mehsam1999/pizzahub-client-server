import Link from "next/link"
import { Home, ArrowLeft, Pizza } from "lucide-react"

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#fff8f2] px-4 py-16">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-[#fcebdc]">
          <Pizza className="size-10 text-[#9b762c]" strokeWidth={1.5} />
        </div>

        {/* 404 */}
        <h1 className="font-serif text-8xl font-bold tracking-tight text-[#421d0d] sm:text-9xl">
          404
        </h1>

        <p className="mt-3 text-xs font-bold tracking-[0.2em] text-[#9b762c] uppercase">
          Oops! Lost in the Kitchen
        </p>

        <h2 className="mt-4 font-serif text-2xl font-bold text-[#421d0d] sm:text-3xl">
          This Page Is Not on Our Menu
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#78675d]">
          Looks like this page has disappeared from our kitchen. Don&apos;t
          worry, there are plenty of delicious pizzas waiting for you!
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#421d0d] px-6 text-sm font-semibold text-white transition hover:bg-[#5a321c]"
          >
            <Home className="size-4" />
            Back to Home
          </Link>

          <Link
            href="/browse-menus"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#e8d5c5] bg-white px-6 text-sm font-semibold text-[#421d0d] transition hover:bg-[#fdf2e5]"
          >
            <ArrowLeft className="size-4" />
            Explore Menus
          </Link>
        </div>

        <p className="mt-10 text-xs text-[#a18c7c]">
          © PizzaHub — Freshly Made, Happily Served.
        </p>
      </div>
    </main>
  )
}
