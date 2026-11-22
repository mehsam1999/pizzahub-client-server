
"use client"

import { useCallback, useEffect, useState } from "react"
import {
  CreditCard,
  RefreshCw,
  Users,
  DollarSign,
  CheckCircle,
  CalendarDays,
} from "lucide-react"

import {
  getTransactions,
  type Transaction,
} from "@/lib/actions/transactions"
import { useSession } from "@/lib/auth-client"

const AdminTransactionPage = () => {
  const { data: session, isPending: sessionLoading } = useSession()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const isAdmin = session?.user?.role === "admin"

  // Fetch transactions
  const loadTransactions = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setLoading(true)
    }

    try {
      const result = await getTransactions()

      if (result.success) {
        setTransactions(result.data)
      } else {
        setTransactions([])
      }
    } catch (error) {
      console.error("Transaction loading error:", error)
      setTransactions([])
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
        const result = await getTransactions()

        if (!active) return

        if (result.success) {
          setTransactions(result.data)
        } else {
          setTransactions([])
        }
      } catch (error) {
        if (!active) return

        console.error("Transaction loading error:", error)
        setTransactions([])
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

  // Format amount
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency?.toUpperCase() || "USD",
    }).format(amount / 100)
  }

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const totalRevenue = transactions.reduce(
    (total, item) => total + item.amount,
    0
  )

  const totalVendors = new Set(
    transactions.map((item) => item.vendorEmail)
  ).size

  // Authentication loading
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

  // Transaction loading
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eadfd2] border-t-[#3d2010]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-8 bg-[#fdf8f1] p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#3d2010] md:text-3xl">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-[#8a7565]">
            Manage premium vendor subscription transactions.
          </p>
        </div>

        <button
          onClick={() => loadTransactions(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#3d2010] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a321c]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-[#eadfd2] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8a7565]">
                Total Transactions
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#3d2010]">
                {transactions.length}
              </h2>
            </div>
            <div className="rounded-lg bg-[#fff4d6] p-3">
              <CreditCard className="text-[#b78619]" size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#eadfd2] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8a7565]">
                Premium Vendors
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#3d2010]">
                {totalVendors}
              </h2>
            </div>
            <div className="rounded-lg bg-[#fff4d6] p-3">
              <Users className="text-[#b78619]" size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#eadfd2] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#8a7565]">
                Total Revenue
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[#3d2010]">
                {transactions.length > 0
                  ? formatAmount(
                      totalRevenue,
                      transactions[0].currency
                    )
                  : "$0.00"}
              </h2>
            </div>
            <div className="rounded-lg bg-[#fff4d6] p-3">
              <DollarSign className="text-[#b78619]" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-xl border border-[#eadfd2] bg-white">
        <div className="border-b border-[#eadfd2] p-5">
          <h2 className="text-lg font-bold text-[#3d2010]">
            Premium Transactions
          </h2>
          <p className="mt-1 text-sm text-[#8a7565]">
            Payment history of premium vendors.
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <CreditCard size={40} className="text-[#c5b5a5]" />
            <h3 className="mt-4 font-semibold text-[#3d2010]">
              No Transactions Found
            </h3>
            <p className="mt-2 text-sm text-[#8a7565]">
              No successful premium transactions are available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-[#faf5ee] text-sm text-[#765c49]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Vendor</th>
                  <th className="px-5 py-4 font-semibold">Subscription</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Payment Status</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Transaction ID</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0e7dd]">
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.sessionId || transaction._id || index}
                    className="transition hover:bg-[#fdf8f1]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#3d2010]">
                        {transaction.vendorName || "Unknown Vendor"}
                      </p>
                      <p className="mt-1 text-xs text-[#8a7565]">
                        {transaction.vendorEmail}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#fff4d6] px-3 py-1 text-xs font-semibold text-[#9b7117]">
                        {transaction.planName || "Premium"}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#3d2010]">
                      {formatAmount(
                        transaction.amount,
                        transaction.currency
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        <CheckCircle size={14} />
                        {transaction.paymentStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#765c49]">
                        <CalendarDays size={15} />
                        {formatDate(transaction.transactionDate)}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p
                        className="max-w-[150px] truncate text-xs text-[#8a7565]"
                        title={transaction.sessionId}
                      >
                        {transaction.sessionId}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {transactions.length > 0 && (
          <div className="border-t border-[#eadfd2] px-5 py-4 text-sm text-[#8a7565]">
            Showing {transactions.length} transactions
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminTransactionPage
