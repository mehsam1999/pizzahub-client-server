
"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Utensils,
  RefreshCw,
} from "lucide-react"

import { useSession } from "@/lib/auth-client"
import { getCustomerOrders, type Order } from "@/lib/actions/orders"

const CustomerDashboardPage = () => {
  const { data: session, isPending: sessionLoading } = useSession()

  const [orders, setOrders] = useState<Order[]>([])
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null)
  const [error, setError] = useState("")

  const userId = session?.user?.id

  // Loading is derived instead of using a separate loading state
  const loading =
    sessionLoading || (!!userId && loadedUserId !== userId)

  // Fetch customer orders
  useEffect(() => {
    if (sessionLoading || !userId) return

    let active = true

    const fetchOrders = async () => {
      try {
        const result = await getCustomerOrders(userId)

        if (!active) return

        setOrders(result)
        setError("")
      } catch (err) {
        console.error("Failed to load customer overview:", err)

        if (active) {
          setError("Unable to load your order overview.")
        }
      } finally {
        if (active) {
          setLoadedUserId(userId)
        }
      }
    }

    void fetchOrders()

    return () => {
      active = false
    }
  }, [userId, sessionLoading])

  // Prevent showing previous user's orders
  const currentOrders =
    userId && loadedUserId === userId ? orders : []

  // Calculate order statistics
  const stats = useMemo(() => {
    return [
      {
        title: "Total Orders",
        value: currentOrders.length,
        description: "All your orders",
        icon: ShoppingBag,
        color: "bg-[#f7efd7] text-[#8b5a24]",
      },
      {
        title: "Pending",
        value: currentOrders.filter(
          (order) => order.status === "Pending"
        ).length,
        description: "Waiting for vendor approval",
        icon: Clock,
        color: "bg-amber-50 text-amber-600",
      },
      {
        title: "Accepted",
        value: currentOrders.filter(
          (order) => order.status === "Accepted"
        ).length,
        description: "Orders accepted by vendors",
        icon: CheckCircle2,
        color: "bg-green-50 text-green-600",
      },
      {
        title: "Rejected",
        value: currentOrders.filter(
          (order) => order.status === "Rejected"
        ).length,
        description: "Orders rejected by vendors",
        icon: XCircle,
        color: "bg-red-50 text-red-600",
      },
    ]
  }, [currentOrders])

  return (
    <main className="min-h-screen bg-[#fdf7ef] px-4 py-7 text-[#421d0d] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* Header */}
        <div>
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8b5a24]">
            <Utensils className="size-3.5" />
            PizzaHub Customer Panel
          </p>

          <h1 className="mt-2 font-serif text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            Customer Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6b5a4e]">
            Welcome back, {session?.user?.name || "Customer"}!
            Here is your order overview.
          </p>
        </div>

        {/* Overview Cards */}
        <section className="mt-8">
          <h2 className="mb-4 font-serif text-xl font-semibold">
            Order Overview
          </h2>

          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-[#ead9cc] bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#8b7569]">
                        {stat.title}
                      </p>

                      <p className="mt-2 font-serif text-3xl font-bold text-[#421d0d]">
                        {loading ? "—" : stat.value}
                      </p>
                    </div>

                    <div
                      className={`flex size-12 items-center justify-center rounded-xl ${stat.color}`}
                    >
                      <Icon className="size-6" />
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-[#8b7569]">
                    {stat.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[#ead9cc] bg-white py-8 text-sm text-[#8b7569]">
            <RefreshCw className="size-4 animate-spin" />
            Loading your dashboard...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && userId && currentOrders.length === 0 && (
          <div className="mt-6 rounded-xl border border-[#ead9cc] bg-white px-5 py-10 text-center">
            <ShoppingBag className="mx-auto size-10 text-[#c4a88e]" />

            <h3 className="mt-3 font-serif text-lg font-semibold">
              No Orders Yet
            </h3>

            <p className="mt-1 text-sm text-[#8b7569]">
              Your order summary will appear here once you place an order.
            </p>
          </div>
        )}

      </div>
    </main>
  )
}

export default CustomerDashboardPage
