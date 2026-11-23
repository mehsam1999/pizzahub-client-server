"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  CheckCircle2,
  Clock3,
  Crown,
  ShoppingBag,
  Utensils,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { useSession } from "@/lib/auth-client"
import { getMenus } from "@/lib/api/getMenus"
import { getVendorOrders, type Order } from "@/lib/actions/orders"
import type { MenuItem } from "@/lib/types/menu"

export default function VendorDashboardPage() {
  const { data: session } = useSession()
  const vendorId = session?.user?.id
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [premium, setPremium] = useState<boolean | null>(null)

  useEffect(() => {
    if (!vendorId) return
    let active = true

    Promise.allSettled([
      getMenus(),
      getVendorOrders(),
      fetch("/api/subscription/status", { cache: "no-store" }).then((res) => {
        if (!res.ok) throw new Error("Failed to load subscription")
        return res.json() as Promise<{ premium?: boolean }>
      }),
    ]).then(([menuResult, orderResult, subscriptionResult]) => {
      if (!active) return
      if (menuResult.status === "fulfilled") {
        setMenus(
          menuResult.value.filter(
            (item) => String(item.vendorId) === String(vendorId)
          )
        )
      } else {
        console.error("Failed to load vendor menu items:", menuResult.reason)
      }
      if (orderResult.status === "fulfilled") setOrders(orderResult.value)
      else console.error("Failed to load vendor orders:", orderResult.reason)
      if (subscriptionResult.status === "fulfilled") {
        setPremium(subscriptionResult.value.premium === true)
      } else {
        console.error("Failed to load subscription status:", subscriptionResult.reason)
      }
    })

    return () => {
      active = false
    }
  }, [vendorId])

  const stats = [
    {
      label: "Total Menu Items",
      value: menus.length,
      icon: Utensils,
      detail: "Items in your menu",
      href: "/dashboard/vendor/menu-items",
    },
    {
      label: "Active Menu Items",
      value: menus.filter((item) => item.status === "Approved").length,
      icon: CheckCircle2,
      detail: "Approved and available",
      href: "/dashboard/vendor/menu-items",
    },
    {
      label: "Pending Customer Orders",
      value: orders.filter((order) => order.status === "Pending").length,
      icon: Clock3,
      detail: "Awaiting your response",
      href: "/dashboard/vendor/orders",
    },
    {
      label: "Accepted Orders",
      value: orders.filter((order) => order.status === "Accepted").length,
      icon: ShoppingBag,
      detail: "Orders you have accepted",
      href: "/dashboard/vendor/orders",
    },
  ]

  return (
    <main className="min-h-screen bg-[#fff9f5] px-4 py-7 text-[#421d0d] sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-3 text-[10px] font-bold tracking-[0.2em] text-[#9b6b4e] uppercase">
            Vendor Dashboard
          </p>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">
            Overview
          </h1>
          <p className="mt-2 text-sm text-[#806d60]">
            A quick look at your menu, orders, and subscription.
          </p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-[#f6c445] via-[#421d0d]/30 to-transparent" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, detail, href }) => (
            <Link href={href} key={label} className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b6b4e]">
              <Card className="h-full rounded-xl border border-[#ead9cc] bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5">
                <div className="flex items-center justify-between">
                  <p className="min-w-0 break-words text-xs font-semibold text-[#806d60]">{label}</p>
                  <span className="rounded-lg bg-[#fff1e5] p-2 text-[#a66a3f]">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-5 font-serif text-3xl font-bold tabular-nums">
                  {value}
                </p>
                <p className="mt-1 text-xs text-[#9b8c81]">{detail}</p>
              </Card>
            </Link>
          ))}

          <Link href="/dashboard/vendor/subscription" className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b6b4e]">
            <Card className="h-full rounded-xl border border-[#ead9cc] bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5">
              <div className="flex items-center justify-between">
                <p className="min-w-0 break-words text-xs font-semibold text-[#806d60]">Current Subscription Plan</p>
                <span className="rounded-lg bg-[#fff1e5] p-2 text-[#a66a3f]">
                  <Crown className="size-4" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-5 font-serif text-3xl font-bold">
                {premium === null ? "—" : premium ? "Premium" : "Free"}
              </p>
              <p className="mt-1 text-xs text-[#9b8c81]">
                {premium === null ? "Checking your plan" : "Manage your subscription"}
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}
