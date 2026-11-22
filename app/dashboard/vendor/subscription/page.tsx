
"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"

import {
  Check,
  X,
  Crown,
  Zap,
  Store,
  Search,
  BarChart3,
  ChefHat,
  BadgeCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/toast"

const SubscriptionPage = () => {
  const searchParams = useSearchParams()

  const canceled = searchParams.get("canceled")
  const success = searchParams.get("success")
  const plan = searchParams.get("plan")

  const [isPremium, setIsPremium] = useState(false)
  const [checkingSubscription, setCheckingSubscription] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  // Prevent duplicate Premium toast
  const premiumToastShown = useRef(false)

  // Check subscription status when page loads
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await fetch("/api/subscription/status", {
          cache: "no-store",
        })

        if (!res.ok) {
          throw new Error("Failed to check subscription")
        }

        const data = await res.json()

        if (data.premium === true) {
          setIsPremium(true)

          // Show Premium toast only once
          if (!premiumToastShown.current) {
            premiumToastShown.current = true

            toast.add({
              title: "Already a Premium User",
              description:
                "You already have an active Premium subscription. No need to upgrade again.",
              type: "success",
            })
          }
        }
      } catch (error) {
        console.error("Subscription check error:", error)

        toast.add({
          title: "Subscription Check Failed",
          description:
            "Unable to verify your subscription. Please try again.",
          type: "error",
        })
      } finally {
        setCheckingSubscription(false)
      }
    }

    checkSubscription()
  }, [])

  // Handle Stripe Checkout
  const handleUpgrade = async () => {
    if (checkingSubscription || upgrading) {
      return
    }

    // Already Premium: no additional toast
    if (isPremium) {
      return
    }

    try {
      setUpgrading(true)

      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
      })

      const data = await res.json()

      if (
        res.status === 409 &&
        data.code === "ALREADY_PREMIUM"
      ) {
        setIsPremium(true)
        return
      }

      if (!res.ok) {
        throw new Error(
          data.error || data.message || "Unable to start checkout"
        )
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("Checkout URL was not received")
      }
    } catch (error) {
      console.error("Checkout error:", error)

      toast.add({
        title: "Checkout Failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to start your subscription.",
        type: "error",
      })
    } finally {
      setUpgrading(false)
    }
  }

  // Handle Stripe Checkout redirect
  useEffect(() => {
    if (canceled === "true") {
      toast.add({
        title: "Payment canceled",
        description:
          "Your checkout was canceled. You can try again anytime.",
        type: "error",
      })
    }

    if (success === "true") {
      toast.add({
        title: "Payment submitted",
        description:
          "Your payment is being verified. Premium access will be activated after confirmation.",
        type: "success",
      })
    }

    if (plan) {
      console.log("Selected subscription plan:", plan)
    }
  }, [canceled, success, plan])

  const freeFeatures = [
    {
      title: "Maximum 3 Menu Items",
      description: "Rotation capped at three live wood-fired recipes",
      available: true,
    },
    {
      title: "Basic Artisan Dashboard",
      description: "7-day order history & standard kitchen metrics",
      available: true,
    },
    {
      title: "Live Order Dispatch",
      description: "Accept customer orders & fulfill them generation",
      available: true,
    },
    {
      title: "Standard Kitchen Support",
      description: "Community documentation & 48h email turnaround",
      available: true,
    },
    {
      title: "Artisan Verified Golden Seal",
      description: "Standard storefront listing badge",
      available: false,
    },
    {
      title: "Featured Top-of-Search Placement",
      description: "Standard alphabetical and distance placement",
      available: false,
    },
  ]

  const premiumFeatures = [
    {
      icon: Zap,
      title: "Unlimited Menu Items",
      description:
        "Publish daily specials, seasonal doughs, and drink pairing collections",
    },
    {
      icon: Store,
      title: "Artisan Gold Marketplace Badge",
      description:
        "Boosts conversion with verified craft authenticity signals",
    },
    {
      icon: Search,
      title: "Featured Menu & Search Placement",
      description:
        "Prime algorithmic spotlighting in consumer feeds and local discovery",
    },
    {
      icon: BarChart3,
      title: "Advanced Crust & Sales Analytics",
      description:
        "Peak dough-hour heatmaps, order generation reviews & profitability",
    },
    {
      icon: ChefHat,
      title: "Dedicated Kitchen Success Manager",
      description:
        "One-on-one optimization, recipe photo staging & priority 15m support",
    },
    {
      icon: BadgeCheck,
      title: "Custom Dough Fermentation Badges",
      description:
        "Showcase your craft from 12h, 24h, 48h and 72h fermentation",
    },
  ]

  return (
    <div className="min-h-screen bg-[#fff9f5] px-3 py-7 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Crown className="size-3.5 text-[#c8815a]" />

            <p className="text-[10px] font-bold tracking-[0.2em] text-[#9b6b4e] uppercase">
              Membership & Growth
            </p>
          </div>

          <h1 className="font-serif text-3xl leading-tight font-bold text-[#421d0d] sm:text-4xl lg:text-5xl">
            Subscription Plans & Tier
            <br className="hidden sm:block" /> Management
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#806d60]">
            Select the optimal plan to scale your artisan kitchen on the
            PizzaHub network. Unlock unlimited seasonal specials and featured
            placement.
          </p>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-[#f6c445] via-[#421d0d]/40 to-transparent" />
        </div>

        {/* Subscription Plans */}
        <div className="grid items-stretch gap-5 lg:grid-cols-2">
          {/* Free Plan */}
          <Card className="relative flex flex-col gap-0 overflow-hidden rounded-2xl border border-[#421d0d]/8 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#9b6b4e] uppercase">
                Starter Tier
              </p>

              <span className="rounded-full bg-[#f6e7d9] px-3 py-1 text-[9px] font-bold text-[#806000]">
                Current Tier
              </span>
            </div>

            <h2 className="mt-3 font-serif text-2xl font-bold text-[#421d0d]">
              Free Forever
            </h2>

            <p className="mt-2 min-h-10 text-xs leading-relaxed text-[#806d60]">
              Ideal for emerging craft bakers, single-station wood-fired
              operations, and micro-kitchen pop-ups testing the market.
            </p>

            {/* Price */}
            <div className="mt-5 rounded-xl bg-[#fff5ec] p-4">
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-4xl font-bold text-[#421d0d]">
                  $0
                </span>

                <span className="text-xs text-[#806d60]">/month</span>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6 flex-1">
              <p className="mb-4 text-[9px] font-bold tracking-[0.15em] text-[#9b6b4e] uppercase">
                Included Privileges
              </p>

              <div className="space-y-4">
                {freeFeatures.map((feature) => (
                  <div key={feature.title} className="flex gap-3">
                    <div
                      className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full ${
                        feature.available
                          ? "bg-[#f6e7d9] text-[#a66a3f]"
                          : "bg-[#f3efeb] text-[#c6b9ae]"
                      }`}
                    >
                      {feature.available ? (
                        <Check size={10} strokeWidth={3} />
                      ) : (
                        <X size={10} strokeWidth={3} />
                      )}
                    </div>

                    <div>
                      <p
                        className={`text-[11px] font-semibold ${
                          feature.available
                            ? "text-[#421d0d]"
                            : "text-[#a89b91]"
                        }`}
                      >
                        {feature.title}
                      </p>

                      <p className="mt-0.5 text-[9px] leading-relaxed text-[#9b8c81]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="button"
              disabled
              className="mt-7 h-11 w-full rounded-lg bg-[#f6e7d9] text-[11px] font-semibold text-[#806d60] opacity-100"
            >
              <Check size={14} />
              Active Operational Plan
            </Button>
          </Card>

          {/* Premium Plan */}
          <Card className="relative flex flex-col gap-0 overflow-hidden rounded-2xl border border-[#d8a92c]/30 bg-gradient-to-b from-[#ffdf77] via-[#f5c653] to-[#421d0d] p-5 shadow-[0_20px_40px_-20px_rgba(66,29,13,0.5)] sm:p-7">
            {/* Recommended badge */}
            <div className="absolute top-0 right-0 flex items-center gap-1 rounded-bl-lg bg-[#f3bd36] px-3 py-1.5 text-[8px] font-bold tracking-wide text-[#57340c] uppercase shadow-sm">
              <Crown size={11} />
              Artisan Choice • Recommended
            </div>

            <div className="mt-5">
              <p className="text-[10px] font-bold tracking-[0.15em] text-[#75510b] uppercase">
                Unrestricted Growth
              </p>

              <h2 className="mt-3 font-serif text-2xl font-bold text-[#421d0d]">
                PizzaHub Premium
              </h2>

              <p className="mt-2 min-h-10 text-xs leading-relaxed text-[#70542b]">
                Engineered for established pizzerias, high-output kitchens, and
                culinary masters seeking maximum marketplace visibility.
              </p>
            </div>

            {/* Price */}
            <div className="mt-5 rounded-xl bg-[#fff8ed] p-4 shadow-sm">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-bold text-[#421d0d]">
                    $49
                  </span>

                  <span className="text-xs text-[#806d60]">/month</span>
                </div>

                <span className="rounded-full bg-[#fce9b5] px-2.5 py-1 text-[8px] font-bold text-[#806000]">
                  Billed monthly
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6 flex-1">
              <p className="mb-4 text-[9px] font-bold tracking-[0.15em] text-[#57340c] uppercase">
                Uncapped Capabilities
              </p>

              <div className="space-y-4">
                {premiumFeatures.map((feature) => {
                  const Icon = feature.icon

                  return (
                    <div key={feature.title} className="flex gap-3">
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#eebc25] text-[#57340c]">
                        <Icon size={11} strokeWidth={2.5} />
                      </div>

                      <div>
                        <p className="text-[11px] font-bold text-[#421d0d]">
                          {feature.title}
                        </p>

                        <p className="mt-0.5 text-[9px] leading-relaxed text-[#70542b]">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Upgrade Button */}
            <div className="mt-7">
              <Button
                type="button"
                onClick={handleUpgrade}
                disabled={
                  isPremium ||
                  checkingSubscription ||
                  upgrading
                }
                className="h-11 w-full rounded-lg bg-[#ffcf3f] text-[11px] font-bold text-[#421d0d] shadow-sm hover:bg-[#f5bd25] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {checkingSubscription ? (
                  "Checking Subscription..."
                ) : isPremium ? (
                  <>
                    <Check size={14} />
                    Already a Premium User
                  </>
                ) : upgrading ? (
                  "Redirecting to Checkout..."
                ) : (
                  <>
                    <Crown size={14} />
                    Upgrade to Premium
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPage
