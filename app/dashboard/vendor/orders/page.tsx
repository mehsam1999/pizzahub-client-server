
"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import {
  ShoppingBag,
  UserRound,
  Mail,
  CalendarDays,
  MapPin,
  MessageSquare,
  Check,
  X,
  Clock,
  PackageCheck,
  RefreshCw,
  ClipboardList,
} from "lucide-react"

import {
  getVendorOrders,
  updateVendorOrderStatus,
  type Order,
  type OrderStatus,
} from "@/lib/actions/orders"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(
    null
  )
  const [filter, setFilter] = useState<"All" | OrderStatus>("All")

  // Initial data loading
  useEffect(() => {
    let isMounted = true

    const fetchOrders = async () => {
      try {
        const data = await getVendorOrders()

        if (isMounted) {
          setOrders(data)
        }
      } catch (error) {
        console.error("Vendor orders error:", error)

        if (isMounted) {
          toast.add({
            title: "Unable to load orders",
            description:
              error instanceof Error
                ? error.message
                : "Please try again later.",
            type: "error",
          })
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchOrders()

    return () => {
      isMounted = false
    }
  }, [])

  // Refresh orders manually
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)

      const data = await getVendorOrders()
      setOrders(data)
    } catch (error) {
      console.error("Vendor orders error:", error)

      toast.add({
        title: "Unable to load orders",
        description:
          error instanceof Error
            ? error.message
            : "Please try again later.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  // Accept or Reject order
  const handleOrderAction = async (
    orderId: string,
    status: "Accepted" | "Rejected"
  ) => {
    if (processingOrderId) return

    try {
      setProcessingOrderId(orderId)

      await updateVendorOrderStatus(orderId, status)

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? { ...order, status }
            : order
        )
      )

      toast.add({
        title: status === "Accepted" ? "Order accepted" : "Order rejected",
        description:
          status === "Accepted"
            ? "The customer order has been accepted successfully."
            : "The customer order has been rejected.",
        type: "success",
      })
    } catch (error) {
      console.error("Order status update error:", error)

      toast.add({
        title: "Action failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update this order.",
        type: "error",
      })

      // Refresh in case the order was already processed elsewhere
      await loadOrders()
    } finally {
      setProcessingOrderId(null)
    }
  }

  // Filter orders
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter)

  // Order counts
  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length

  const acceptedCount = orders.filter(
    (order) => order.status === "Accepted"
  ).length

  const rejectedCount = orders.filter(
    (order) => order.status === "Rejected"
  ).length

  return (
    <main className="min-h-screen bg-[#fff9f5] px-4 py-7 text-[#421d0d] sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ShoppingBag className="size-4 text-[#c8815a]" />

              <p className="text-[10px] font-bold tracking-[0.2em] text-[#9b6b4e] uppercase">
                Vendor Dashboard
              </p>
            </div>

            <h1 className="font-serif text-3xl leading-tight font-bold sm:text-4xl">
              Customer Orders
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#806d60]">
              View customer requests for your menu items and manage incoming
              orders.
            </p>
          </div>

          <Button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="h-10 w-full rounded-lg bg-[#421d0d] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#60301a] sm:w-auto"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Orders
          </Button>
        </div>

        <div className="mb-7 h-px w-full bg-gradient-to-r from-[#f6c445] via-[#421d0d]/30 to-transparent" />

        {/* Summary Cards */}
        <div className="mb-7 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Orders"
            count={orders.length}
            icon={<ClipboardList size={18} />}
          />

          <SummaryCard
            title="Pending"
            count={pendingCount}
            icon={<Clock size={18} />}
          />

          <SummaryCard
            title="Accepted"
            count={acceptedCount}
            icon={<PackageCheck size={18} />}
          />

          <SummaryCard
            title="Rejected"
            count={rejectedCount}
            icon={<X size={18} />}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {(
            ["All", "Pending", "Accepted", "Rejected", "Cancelled"] as const
          ).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`min-h-9 rounded-full px-3 py-2 text-[11px] font-semibold transition-colors duration-200 sm:px-4 ${
                filter === status
                  ? "bg-[#421d0d] text-white"
                  : "border border-[#ead9cc] bg-white text-[#806d60] hover:border-[#421d0d]"
              }`}
            >
              {status}
              {status === "All" && ` (${orders.length})`}
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="rounded-2xl border border-[#ead9cc] bg-white py-16 text-center">
            <RefreshCw className="mx-auto size-7 animate-spin text-[#9b6b4e]" />

            <p className="mt-3 text-sm text-[#806d60]">
              Loading customer orders...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9c5b7] bg-white px-5 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#fff0e4] text-[#9b6b4e]">
              <ShoppingBag size={25} />
            </div>

            <h2 className="mt-4 font-serif text-xl font-bold">
              No orders found
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-[#806d60]">
              {filter === "All"
                ? "When customers order your menu items, their orders will appear here."
                : `There are currently no ${filter.toLowerCase()} orders.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                processing={processingOrderId === order._id}
                onAccept={() =>
                  handleOrderAction(order._id, "Accepted")
                }
                onReject={() =>
                  handleOrderAction(order._id, "Rejected")
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

// Summary Card
function SummaryCard({
  title,
  count,
  icon,
}: {
  title: string
  count: number
  icon: React.ReactNode
}) {
  return (
    <Card className="flex flex-col gap-2 rounded-xl border border-[#ead9cc] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-[#806d60] sm:text-xs">
          {title}
        </p>

        <span className="text-[#b17b4e]">{icon}</span>
      </div>

      <p className="font-serif text-2xl font-bold sm:text-3xl">
        {count}
      </p>
    </Card>
  )
}

// Order Card
function OrderCard({
  order,
  processing,
  onAccept,
  onReject,
}: {
  order: Order
  processing: boolean
  onAccept: () => void
  onReject: () => void
}) {
  const statusStyles: Record<OrderStatus, string> = {
    Pending: "bg-amber-100 text-amber-800",
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Cancelled: "bg-gray-100 text-gray-700",
  }

  // Format order placed date
  const createdDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not available"

  return (
    <Card className="overflow-hidden rounded-2xl border border-[#ead9cc] bg-white p-0 shadow-sm">

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e3d9] bg-[#fff5ec] px-4 py-4 sm:px-5">
        <div>
          <p className="text-[9px] font-bold tracking-[0.15em] text-[#9b6b4e] uppercase">
            Order Received
          </p>

          <p className="mt-1 text-xs font-semibold text-[#421d0d]">
            #{order._id.slice(-8).toUpperCase()}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${statusStyles[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      <div className="p-4 sm:p-5">

        {/* Item Information */}
        <div className="flex gap-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#f5e6da]">
            {order.imageUrl ? (
              <Image
                src={order.imageUrl}
                alt={order.itemName}
                fill
                unoptimized
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ShoppingBag size={22} className="text-[#b18b70]" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-semibold tracking-wider text-[#9b6b4e] uppercase">
              Ordered Menu Item
            </p>

            <h3 className="mt-1 line-clamp-2 font-serif text-lg font-bold text-[#421d0d]">
              {order.itemName}
            </h3>

            <p className="mt-1 text-[10px] text-[#806d60]">
              {order.itemCategory}
            </p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mt-5 rounded-xl bg-[#fff9f5] p-3.5">
          <p className="mb-3 text-[9px] font-bold tracking-wider text-[#9b6b4e] uppercase">
            Customer Information
          </p>

          <div className="space-y-2.5">
            <DetailRow
              icon={<UserRound size={14} />}
              label="Customer"
              value={order.customerName}
            />

            <DetailRow
              icon={<Mail size={14} />}
              label="Email"
              value={order.email}
            />
          </div>
        </div>

        {/* Delivery Information */}
        <div className="mt-4">
          <p className="mb-3 text-[9px] font-bold tracking-wider text-[#9b6b4e] uppercase">
            Delivery Information
          </p>

          <div className="space-y-3">
            <DetailRow
              icon={<CalendarDays size={14} />}
              label="Delivery Date"
              value={order.deliveryDate || "Not provided"}
            />

            <DetailRow
              icon={<MapPin size={14} />}
              label="Address"
              value={order.deliveryAddress || "Not provided"}
            />

            <DetailRow
              icon={<Clock size={14} />}
              label="Order Placed"
              value={createdDate}
            />
          </div>
        </div>

        {/* Customer Message */}
        <div className="mt-4 rounded-xl border border-[#ead9cc] p-3.5">
          <div className="flex items-center gap-2 text-[#9b6b4e]">
            <MessageSquare size={14} />

            <p className="text-[9px] font-bold tracking-wider uppercase">
              Customer Message
            </p>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-[#59483e]">
            {order.message?.trim() ||
              "No additional message from customer."}
          </p>
        </div>

        {/* Actions */}
        {order.status === "Pending" ? (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={onAccept}
              disabled={processing}
              className="h-10 rounded-lg bg-[#267747] text-xs font-semibold text-white hover:bg-[#1e633a] disabled:opacity-60"
            >
              <Check size={15} />

              {processing ? "Processing..." : "Accept Order"}
            </Button>

            <Button
              type="button"
              onClick={onReject}
              disabled={processing}
              className="h-10 rounded-lg bg-[#a83232] text-xs font-semibold text-white hover:bg-[#8c2525] disabled:opacity-60"
            >
              <X size={15} />

              {processing ? "Processing..." : "Reject Order"}
            </Button>
          </div>
        ) : (
          <div className="mt-5 rounded-lg bg-[#f8f3ef] px-3 py-3 text-center">
            <p className="text-[10px] font-semibold text-[#806d60]">
              This order has already been {order.status.toLowerCase()}.
              No further action is available.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

// Detail Row
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-[#a66a3f]">
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] text-[#9b8c81]">
          {label}
        </p>

        <p className="mt-0.5 break-words text-xs font-medium text-[#421d0d]">
          {value}
        </p>
      </div>
    </div>
  )
}

export default CustomerOrdersPage
