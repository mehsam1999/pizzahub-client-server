"use client"

import { useEffect, useMemo, useState } from "react"
import { Utensils, X } from "lucide-react"

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
import {
  ORDER_STATUSES,
  OrderStatusBadge,
} from "@/app/components/OrderStatusBadge"

import { CancelOrderDialog } from "@/app/components/CancelOrderDialog"

import {
  getCustomerOrders,
  cancelCustomerOrder,
  type Order,
} from "@/lib/actions/orders"

import { useSession } from "@/lib/auth-client"
import { toast } from "@/components/ui/toast"

const PAGE_SIZE = 6

const CustomerMyOrdersPage = () => {
  const { data: session } = useSession()
  const user = session?.user

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const [showDetailsCancelDialog, setShowDetailsCancelDialog] = useState(false)

  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<OrderStatusFilterValue>("All")
  const [page, setPage] = useState(1)

  // Fetch Customer Orders
  useEffect(() => {
    if (!user?.id) return

    getCustomerOrders(user.id)
      .then(setOrders)
      .catch((error) => {
        console.error("Failed to load orders:", error)
      })
      .finally(() => setLoading(false))
  }, [user?.id])

  // Cancel Order
  const handleCancelOrder = async (order: Order) => {
    if (!user?.id || order.status !== "Pending") return

    try {
      setCancelingOrderId(order._id)

      await cancelCustomerOrder(order._id, user.id)

      setOrders((prevOrders) =>
        prevOrders.map((item) =>
          item._id === order._id ? { ...item, status: "Cancelled" } : item
        )
      )

      if (selectedOrder?._id === order._id) {
        setSelectedOrder({ ...order, status: "Cancelled" })
      }

      toast.add({
        title: "Order Cancelled",
        description: "Your order has been cancelled successfully.",
      })
    } catch (error) {
      console.error("Failed to cancel order:", error)

      toast.add({
        title: "Cancellation Failed",
        description: "Unable to cancel your order. Please try again.",
      })
    } finally {
      setCancelingOrderId(null)
    }
  }

  // Search and Filter
  const filteredOrders = useMemo(() => {
    const search = query.trim().toLowerCase()

    return orders.filter((order) => {
      const matchesSearch =
        !search ||
        [order.itemName, order.vendorName, order.itemCategory]
          .join(" ")
          .toLowerCase()
          .includes(search)

      return matchesSearch && (status === "All" || order.status === status)
    })
  }, [orders, query, status])

  // Order Counts
  const counts = useMemo(() => {
    const totals: Partial<Record<OrderStatusFilterValue, number>> = {
      All: orders.length,
    }

    for (const option of ORDER_STATUSES) {
      totals[option] = orders.filter((order) => order.status === option).length
    }

    return totals
  }, [orders])

  // Pagination
  const pageCount = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))

  const currentPage = Math.min(page, pageCount)

  const pageOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const showingFrom = filteredOrders.length
    ? (currentPage - 1) * PAGE_SIZE + 1
    : 0

  const showingTo = Math.min(currentPage * PAGE_SIZE, filteredOrders.length)

  const showingLabel = `Showing ${showingFrom}–${showingTo} of ${filteredOrders.length} orders`

  return (
    <main className="min-h-screen bg-[#fdf7ef] px-3 py-7 text-[#421d0d] sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <p className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.12em] text-[#8b5a24] uppercase sm:text-[10px] sm:tracking-[0.16em]">
          <Utensils className="size-3.5" aria-hidden />
          From Kitchen to Doorstep
        </p>

        <h1 className="mt-2 font-serif text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          My Orders
        </h1>

        <p className="mt-1 max-w-xl text-xs leading-5 text-[#6b5a4e] sm:text-sm">
          Track your orders and delivery information.
        </p>

        {/* Search and Status Filter */}
        <div className="mt-5 rounded-xl bg-[#fdf2e5] p-2 sm:p-2.5">
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

        {/* Orders Table */}
        <section
          aria-label="My orders"
          className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#421d0d]/8"
        >
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed md:table-auto xl:min-w-[900px]">
              <TableHeader className="hidden bg-[#fdf2e5] xl:table-header-group">
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

                  <TableHead className="w-[180px] py-3 pr-4 text-[9px] font-semibold tracking-wide text-[#8b5a24] uppercase">
                    Order status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <td
                      colSpan={6}
                      className="h-32 text-center text-sm text-[#8b7569]"
                    >
                      Loading orders...
                    </td>
                  </TableRow>
                ) : (
                  <>
                    {pageOrders.map((order) => (
                      <MyOrderRow
                        key={order._id}
                        order={order}
                        onView={() => setSelectedOrder(order)}
                        onCancel={() => handleCancelOrder(order)}
                        isCancelling={cancelingOrderId === order._id}
                      />
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-6 shadow-xl sm:max-h-[90vh] sm:max-w-lg sm:rounded-xl sm:pb-5">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              aria-label="Close order details"
              className="absolute top-4 right-4 rounded-full p-1 text-[#6b5a4e] transition-colors hover:bg-[#f3ece2]"
            >
              <X className="size-5" />
            </button>

            <h2 className="pr-8 font-serif text-xl font-bold text-[#421d0d]">
              Order Details
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-[#6b5a4e] [&_p]:break-words sm:grid-cols-2">
              <div>
                <p className="font-semibold text-[#421d0d]">Item Name</p>
                <p>{selectedOrder.itemName}</p>
              </div>

              <div>
                <p className="font-semibold text-[#421d0d]">Category</p>
                <p>{selectedOrder.itemCategory}</p>
              </div>

              <div>
                <p className="font-semibold text-[#421d0d]">Vendor</p>
                <p>{selectedOrder.vendorName}</p>
              </div>

              <div>
                <p className="font-semibold text-[#421d0d]">Delivery Date</p>
                <p>{selectedOrder.deliveryDate}</p>
              </div>

              <div className="min-w-0 sm:col-span-2">
                <p className="font-semibold text-[#421d0d]">Delivery Address</p>
                <p>{selectedOrder.deliveryAddress}</p>
              </div>

              <div className="min-w-0 sm:col-span-2">
                <p className="font-semibold text-[#421d0d]">
                  Additional Message
                </p>
                <p>{selectedOrder.message || "No additional message"}</p>
              </div>

              <div>
                <p className="mb-1 font-semibold text-[#421d0d]">Status</p>
                <OrderStatusBadge status={selectedOrder.status} />
              </div>
            </div>

            {selectedOrder.status === "Pending" && (
              <button
                type="button"
                disabled={cancelingOrderId === selectedOrder._id}
                onClick={() => setShowDetailsCancelDialog(true)}
                className="mt-5 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}

      {/* Details Modal Cancel Confirmation */}
      <CancelOrderDialog
        open={showDetailsCancelDialog}
        onOpenChange={setShowDetailsCancelDialog}
        onConfirm={() => {
          if (selectedOrder) {
            setShowDetailsCancelDialog(false)
            handleCancelOrder(selectedOrder)
          }
        }}
        isCancelling={
          selectedOrder ? cancelingOrderId === selectedOrder._id : false
        }
      />
    </main>
  )
}

export default CustomerMyOrdersPage
