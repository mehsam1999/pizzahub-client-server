
"use client"

import { useEffect, useMemo, useState } from "react"
import { Utensils } from "lucide-react"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { MyOrderRow } from "@/app/components/MyOrderRow"
import { OrderSearchFilter } from "@/app/components/OrderSearchFilter"
import {
  OrderStatusFilter,
  type OrderStatusFilterValue,
} from "@/app/components/OrderStatusFilter"
import { OrderListPagination } from "@/app/components/OrderListPagination"
import { ORDER_STATUSES } from "@/app/components/OrderStatusBadge"

import {
  getCustomerOrders,
  type Order,
} from "@/lib/actions/orders"

import { useSession } from "@/lib/auth-client"

const PAGE_SIZE = 6

const CustomerMyOrdersPage = () => {
  const { data: session } = useSession()
  const user = session?.user

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<OrderStatusFilterValue>("All")
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!user?.id) return

    getCustomerOrders(user.id)
      .then(setOrders)
      .catch((error) => {
        console.error("Failed to load orders:", error)
      })
      .finally(() => setLoading(false))
  }, [user?.id])

  const filteredOrders = useMemo(() => {
    const search = query.trim().toLowerCase()

    return orders.filter((order) => {
      const matchesSearch =
        !search ||
        [
          order.itemName,
          order.vendorName,
          order.itemCategory,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search)

      return matchesSearch && (status === "All" || order.status === status)
    })
  }, [orders, query, status])

  const counts = useMemo(() => {
    const totals: Partial<Record<OrderStatusFilterValue, number>> = {
      All: orders.length,
    }

    for (const option of ORDER_STATUSES) {
      totals[option] = orders.filter(
        (order) => order.status === option
      ).length
    }

    return totals
  }, [orders])

  const pageCount = Math.max(
    1,
    Math.ceil(filteredOrders.length / PAGE_SIZE)
  )

  const currentPage = Math.min(page, pageCount)

  const pageOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const showingFrom = filteredOrders.length
    ? (currentPage - 1) * PAGE_SIZE + 1
    : 0

  const showingTo = Math.min(
    currentPage * PAGE_SIZE,
    filteredOrders.length
  )

  const showingLabel = `Showing ${showingFrom}–${showingTo} of ${filteredOrders.length} orders`

  return (
    <main className="min-h-screen bg-[#fdf7ef] px-3 py-7 text-[#421d0d] sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-8xl">
        <p className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.12em] text-[#8b5a24] uppercase sm:text-[10px] sm:tracking-[0.16em]">
          <Utensils className="size-3.5" aria-hidden />
          From Kitchen to Doorstep
        </p>

        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          My Orders
        </h1>

        <p className="mt-1 max-w-xl text-xs leading-5 text-[#6b5a4e] sm:text-sm">
          Track your orders and delivery information.
        </p>

        <div className="mt-5 rounded-xl bg-[#fdf2e5] p-2.5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <OrderSearchFilter
              value={query}
              onChange={(value) => {
                setQuery(value)
                setPage(1)
              }}
            />

            <div className="sm:shrink-0">
              <OrderStatusFilter
                value={status}
                counts={counts}
                onChange={(value) => {
                  setStatus(value)
                  setPage(1)
                }}
              />
            </div>
          </div>
        </div>

        <section
          aria-label="My orders"
          className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#421d0d]/8"
        >
          <div className="overflow-x-auto">
            <Table className="min-w-[900px] table-fixed">
              <TableHeader className="bg-[#fdf2e5]">
                <TableRow className="border-0 hover:bg-transparent">
                  <TableHead className="w-20 px-4 py-3 text-[9px] font-semibold tracking-wide text-[#8b5a24] uppercase">
                    Item image
                  </TableHead>

                  <TableHead className="w-[190px] py-3 text-[9px] font-semibold tracking-wide text-[#8b5a24] uppercase">
                    Item name
                  </TableHead>

                  <TableHead className="w-[160px] py-3 text-[9px] font-semibold tracking-wide text-[#8b5a24] uppercase">
                    Vendor information
                  </TableHead>

                  <TableHead className="w-[140px] py-3 text-[9px] font-semibold tracking-wide text-[#8b5a24] uppercase">
                    Delivery date
                  </TableHead>

                  <TableHead className="w-[150px] py-3 text-[9px] font-semibold tracking-wide text-[#8b5a24] uppercase">
                    Delivery address
                  </TableHead>

                  <TableHead className="w-[120px] py-3 pr-4 text-[9px] font-semibold tracking-wide text-[#8b5a24] uppercase">
                    Order status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <td colSpan={6} className="h-32 text-center text-sm text-[#8b7569]">
                      Loading orders...
                    </td>
                  </TableRow>
                ) : (
                  <>
                    {pageOrders.map((order) => (
                      <MyOrderRow key={order._id} order={order} />
                    ))}

                    {pageOrders.length === 0 && (
                      <TableRow className="hover:bg-transparent">
                        <td
                          colSpan={6}
                          className="h-32 text-center text-sm text-[#8b7569]"
                        >
                          No orders found.
                        </td>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>

          <OrderListPagination
            page={currentPage}
            pageCount={pageCount}
            totalItems={filteredOrders.length}
            showingLabel={showingLabel}
            onPageChange={setPage}
          />
        </section>
      </div>
    </main>
  )
}

export default CustomerMyOrdersPage
