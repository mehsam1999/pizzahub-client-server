
import type { OrderStatus } from "@/lib/actions/orders"

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Rejected",
  "Cancelled",
]

const STATUS_STYLES: Record<
  OrderStatus,
  { badge: string; dot: string }
> = {
  Pending: {
    badge: "bg-[#f7efd7] text-[#8a6a24]",
    dot: "bg-[#d8a72a]",
  },
  Accepted: {
    badge: "bg-[#eef0de] text-[#6f7a3d]",
    dot: "bg-[#8a9a4a]",
  },
  Rejected: {
    badge: "bg-[#fbe3e0] text-[#b23b2e]",
    dot: "bg-[#d0533f]",
  },
  Cancelled: {
    badge: "bg-[#f3ece2] text-[#6b5a4e]",
    dot: "bg-[#a08a78]",
  },
}

const DEFAULT_STYLE = {
  badge: "bg-[#f3ece2] text-[#6b5a4e]",
  dot: "bg-[#a08a78]",
}

export function OrderStatusBadge({
  status,
}: {
  status?: string | null
}) {
  const normalizedStatus = ORDER_STATUSES.find(
    (item) => item.toLowerCase() === status?.toLowerCase()
  )

  const styles = normalizedStatus
    ? STATUS_STYLES[normalizedStatus]
    : DEFAULT_STYLE

  const displayStatus = normalizedStatus || status || "Unknown"

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[9px] font-semibold tracking-wide uppercase ${styles.badge}`}
    >
      <span
        className={`size-1.5 rounded-full ${styles.dot}`}
        aria-hidden
      />
      {displayStatus}
    </span>
  )
}
