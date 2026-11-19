
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Check, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const tabs = [
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
] as const

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.45a5.52 5.52 0 0 1-2.39 3.62v3.01h3.87c2.26-2.09 3.59-5.17 3.59-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.87-3.01c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.26a7.2 7.2 0 0 1 0-4.52V6.63H1.28a12 12 0 0 0 0 10.74l3.99-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.63l3.99 3.11C6.22 6.89 8.87 4.77 12 4.77Z"
      />
    </svg>
  )
}

const googleButtonClass =
  "flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-[#e2d2bf] bg-white text-sm font-semibold text-[#3d2010] transition-colors hover:bg-[#fdfaf6] focus-visible:ring-2 focus-visible:ring-[#f6c445]/60 focus-visible:outline-none"

const SignUpPage = () => {
  const pathname = usePathname()
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form values
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })

  // Reusable setField function
  const setField = (field: keyof typeof values) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setError(null)

      if (field === "terms") {
        setValues((prev) => ({
          ...prev,
          terms: event.target.checked,
        }))
        return
      }

      setValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }))
    }

  // Better Auth Sign Up
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    setError(null)

    // Password validation
    const passwordValidation =
      values.password.length >= 6 &&
      /[A-Z]/.test(values.password) &&
      /[a-z]/.test(values.password)

    if (!passwordValidation) {
      setError(
        "Password must be at least 6 characters and include one uppercase and one lowercase letter."
      )
      return
    }

    // Confirm password validation
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match. Please re-enter them.")
      return
    }

    // Terms validation
    if (!values.terms) {
      setError("Please accept the Terms of Service and Privacy Policy.")
      return
    }

    try {
      setIsLoading(true)

      const { data, error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "/",
      })

      if (error) {
        setError(error.message || "Unable to create your account.")
        return
      }

      if (data) {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      console.error("Sign up error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-gradient-to-b from-[#fdf6ec] via-[#fdf9f4] to-[#fbeee4] px-5 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl bg-white px-6 py-8 shadow-[0_28px_60px_-40px_rgba(61,32,16,0.5)] ring-1 ring-[#3d2010]/8 sm:px-8 sm:py-9">

          <Link
            href="/"
            className="block text-center font-serif text-xl font-bold tracking-tight text-[#3d2010] transition-opacity hover:opacity-80"
          >
            Pizzahub
          </Link>

          {/* Sign In / Sign Up toggle */}
          <nav
            aria-label="Account access"
            className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-[#f5ecdf] p-1"
          >
            {tabs.map((tab) => {
              const isActive = pathname === tab.href

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-center text-[13px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#f6c445]/60 focus-visible:outline-none sm:text-sm",
                    isActive
                      ? "bg-[#3d2010] text-[#fdf6e3] shadow-sm"
                      : "text-[#6b5a4e] hover:text-[#3d2010]"
                  )}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-7 text-center">
            <h1 className="font-serif text-2xl leading-tight font-bold text-[#3d2010] sm:text-[1.75rem]">
              Create your account
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-[#6b5a4e] sm:text-sm">
              Join PizzaHub to order from local kitchens and follow every pie
              from oven to doorstep.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="sign-up-name" className="text-[#3d2010]">
                Full name
              </Label>
              <Input
                id="sign-up-name"
                name="name"
                value={values.name}
                onChange={setField("name")}
                type="text"
                autoComplete="name"
                placeholder="Mehsam A."
                required
                className="h-11 rounded-xl border-[#e2d2bf] bg-[#fdfaf6] px-3.5 text-[#3d2010] placeholder:text-[#a8907c] focus-visible:border-[#c99a3f] focus-visible:ring-[#f6c445]/40"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="sign-up-email" className="text-[#3d2010]">
                Email address
              </Label>
              <Input
                id="sign-up-email"
                name="email"
                value={values.email}
                onChange={setField("email")}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className="h-11 rounded-xl border-[#e2d2bf] bg-[#fdfaf6] px-3.5 text-[#3d2010] placeholder:text-[#a8907c] focus-visible:border-[#c99a3f] focus-visible:ring-[#f6c445]/40"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="sign-up-password" className="text-[#3d2010]">
                Password
              </Label>

              <div className="relative">
                <Input
                  id="sign-up-password"
                  name="password"
                  value={values.password}
                  onChange={setField("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                  className="h-11 rounded-xl border-[#e2d2bf] bg-[#fdfaf6] pr-11 pl-3.5 text-[#3d2010] placeholder:text-[#a8907c] focus-visible:border-[#c99a3f] focus-visible:ring-[#f6c445]/40"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#a2743a] transition-colors hover:text-[#7d5524] focus-visible:ring-2 focus-visible:ring-[#f6c445]/60 focus-visible:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden />
                  ) : (
                    <Eye className="size-4" aria-hidden />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="sign-up-confirm-password"
                className="text-[#3d2010]"
              >
                Confirm password
              </Label>
              <Input
                id="sign-up-confirm-password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={setField("confirmPassword")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                minLength={6}
                required
                className="h-11 rounded-xl border-[#e2d2bf] bg-[#fdfaf6] px-3.5 text-[#3d2010] placeholder:text-[#a8907c] focus-visible:border-[#c99a3f] focus-visible:ring-[#f6c445]/40"
              />
            </div>

            {/* Terms & Conditions */}
            <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-[#6b5a4e]">
              <input
                type="checkbox"
                name="terms"
                checked={values.terms}
                onChange={setField("terms")}
                required
                className="peer sr-only"
              />

              <span
                aria-hidden
                className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-[#d8c4ae] bg-white transition-colors peer-checked:border-[#3d2010] peer-checked:bg-[#3d2010] peer-focus-visible:ring-2 peer-focus-visible:ring-[#f6c445]/60 peer-focus-visible:ring-offset-1 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
              >
                <Check className="size-3 text-white" strokeWidth={3} />
              </span>

              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-[#a2743a] underline-offset-4 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-[#a2743a] underline-offset-4 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {/* Create Account */}
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-full bg-[#f6c445] text-sm font-semibold text-[#2a1509] transition-colors hover:bg-[#ffd45e] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Error message */}
          {error ? (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-[#fdefef] px-3.5 py-3 text-[12px] leading-relaxed text-[#a33a3a]"
            >
              {error}
            </p>
          ) : null}

          {/* OR separator */}
          <div className="my-6 flex items-center gap-3" aria-hidden>
            <span className="h-px flex-1 bg-[#eadfd2]" />
            <span className="text-[11px] font-semibold tracking-[0.12em] text-[#a8907c] uppercase">
              or
            </span>
            <span className="h-px flex-1 bg-[#eadfd2]" />
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => {
              // TODO: wire up authClient.signIn.social({ provider: "google" })
              console.log("Continue with Google clicked")
            }}
            className={googleButtonClass}
          >
            <GoogleIcon className="size-[18px]" />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-[13px] text-[#6b5a4e]">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#a2743a] underline-offset-4 transition-colors hover:text-[#7d5524] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#8a7565]">
          Protected by PizzaHub. We never share your details.
        </p>
      </div>
    </section>
  )
}

export default SignUpPage
