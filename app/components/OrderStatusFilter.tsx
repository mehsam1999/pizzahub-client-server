"use client"

import { ORDER_STATUSES } from "./OrderStatusBadge"
import type { OrderStatus } from "@/lib/actions/orders"

export type OrderStatusFilterValue = OrderStatus | "All"

/**
 * Status filter for the My Orders list.
 * Passing optional `counts` shows how many orders match, like "(4)".
 */
export function OrderStatusFilter({
  value,
  onChange,
  counts,
}: {
  value: OrderStatusFilterValue
  onChange: (value: OrderStatusFilterValue) => void
  counts?: Partial<Record<OrderStatusFilterValue, number>>
}) {
  const options: OrderStatusFilterValue[] = ["All", ...ORDER_STATUSES]

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const isActive = value === option
        const count = counts?.[option]

        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option)}
            className={`rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors ${
              isActive
                ? "bg-[#421d0d] text-white"
                : "bg-[#fdf2e5] text-[#6b5143] hover:bg-[#f7e4d2]"
            }`}
          >
            {option}
            {count === undefined ? null : ` (${count})`}
          </button>
        )
      })}
    </div>
  )
}
