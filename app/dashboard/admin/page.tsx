
"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  Users,
  Store,
  UserRound,
  UtensilsCrossed,
  Clock,
  CreditCard,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react"

import {
  getAdminOverview,
  type AdminOverviewData,
} from "@/lib/actions/admin-overview"

import { useSession } from "@/lib/auth-client"

const AdminOverviewPage = () => {
  const { data: session, isPending: sessionLoading } = useSession()

  const [overview, setOverview] = useState<AdminOverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const isAdmin = session?.user?.role === "admin"

  // Fetch dashboard overview
  const loadOverview = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setLoading(true)
    }

    setError("")

    try {
      const result = await getAdminOverview()

      if (result.success && result.data) {
        setOverview(result.data)
      } else {
        setError(result.message || "Failed to load overview.")
      }
    } catch (error) {
      console.error("Overview loading error:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    if (sessionLoading || !isAdmin) return

    let active = true

    const fetchData = async () => {
      try {
        const result = await getAdminOverview()

        if (!active) return

        if (result.success && result.data) {
          setOverview(result.data)
        } else {
          setError(result.message || "Failed to load overview.")
        }
      } catch (error) {
        if (!active) return

        console.error("Overview loading error:", error)
        setError("Something went wrong. Please try again.")
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void fetchData()

    return () => {
      active = false
    }
  }, [sessionLoading, isAdmin])

  // Loading session
  if (sessionLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eadfd2] border-t-[#3d2010]" />
      </div>
    )
  }

  // Admin authorization
  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-medium text-red-600">
          You are not authorized to access this page.
        </p>
      </div>
    )
  }

  // Dashboard loading
  if (loading && !overview) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eadfd2] border-t-[#3d2010]" />
      </div>
    )
  }

  const cards = [
    {
      title: "Total Registered Users",
      value: overview?.totalUsers ?? 0,
      description: "All registered accounts",
      icon: Users,
      href: "/dashboard/admin/users",
    },
    {
      title: "Total Vendors",
      value: overview?.totalVendors ?? 0,
      description: "Registered vendor accounts",
      icon: Store,
      href: "/dashboard/admin/users",
    },
    {
      title: "Total Customers",
      value: overview?.totalCustomers ?? 0,
      description: "Registered customer accounts",
      icon: UserRound,
      href: "/dashboard/admin/users",
    },
    {
      title: "Total Menu Items",
      value: overview?.totalMenus ?? 0,
      description: "All menu items on PizzaHub",
      icon: UtensilsCrossed,
      href: "/dashboard/admin/menu-items",
    },
    {
      title: "Pending Menu Items",
      value: overview?.pendingMenus ?? 0,
      description: "Menu items awaiting approval",
      icon: Clock,
      href: "/dashboard/admin/menu-items",
    },
    {
      title: "Total Transactions",
      value: overview?.totalTransactions ?? 0,
      description: "Successful premium payments",
      icon: CreditCard,
      href: "/dashboard/admin/transactions",
    },
  ]

  return (
    <div className="min-h-screen space-y-6 bg-[#fdf8f1] p-3 sm:space-y-8 sm:p-4 md:p-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#3d2010] md:text-3xl">
            Admin Overview
          </h1>

          <p className="mt-2 text-sm text-[#8a7565]">
            Welcome to PizzaHub administration dashboard.
          </p>
        </div>

        <button
          onClick={() => loadOverview(true)}
          disabled={loading}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#3d2010] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#5a321c] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-600">{error}</p>

          <button
            onClick={() => loadOverview(true)}
            className="text-sm font-semibold text-red-700 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <Link
              href={card.href}
              key={card.title}
              className="group min-w-0 rounded-xl border border-[#eadfd2] bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-[#c9a77f] hover:shadow-md sm:p-5 motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="break-words text-sm font-medium text-[#8a7565]">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-[#3d2010]">
                    {card.value}
                  </h2>
                </div>

                <div className="rounded-lg bg-[#fff4d6] p-3">
                  <Icon
                    size={24}
                    className="text-[#b78619]"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-xs text-[#9b8878]">
                  {card.description}
                </p>

                <span className="flex items-center gap-1 text-xs font-semibold text-[#8a7565] transition group-hover:text-[#3d2010]">
                  View Details
                  <ArrowUpRight
                    size={15}
                    className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Navigation */}
      <div className="rounded-xl border border-[#eadfd2] bg-white p-5 md:p-6">
        <h2 className="text-lg font-bold text-[#3d2010]">
          Quick Management
        </h2>

        <p className="mt-1 text-sm text-[#8a7565]">
          Quickly access your administration pages.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link
            href="/dashboard/admin/users"
            className="flex items-center justify-between rounded-lg border border-[#eadfd2] p-4 transition hover:bg-[#fdf8f1]"
          >
            <span className="flex items-center gap-3 text-sm font-semibold text-[#3d2010]">
              <Users size={18} />
              Manage Users
            </span>
            <ArrowUpRight size={17} className="text-[#8a7565]" />
          </Link>

          <Link
            href="/dashboard/admin/menu-items"
            className="flex items-center justify-between rounded-lg border border-[#eadfd2] p-4 transition hover:bg-[#fdf8f1]"
          >
            <span className="flex items-center gap-3 text-sm font-semibold text-[#3d2010]">
              <UtensilsCrossed size={18} />
              Manage Menu Items
            </span>
            <ArrowUpRight size={17} className="text-[#8a7565]" />
          </Link>

          <Link
            href="/dashboard/admin/transactions"
            className="flex items-center justify-between rounded-lg border border-[#eadfd2] p-4 transition hover:bg-[#fdf8f1]"
          >
            <span className="flex items-center gap-3 text-sm font-semibold text-[#3d2010]">
              <CreditCard size={18} />
              Transactions
            </span>
            <ArrowUpRight size={17} className="text-[#8a7565]" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminOverviewPage
