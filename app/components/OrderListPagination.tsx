"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * Footer for a paginated table: a "Showing X of Y" summary plus prev/next.
 * Deliberately simple, because the order list is expected to be small.
 */
export function OrderListPagination({
  page,
  pageCount,
  totalItems,
  showingLabel,
  onPageChange,
}: {
  page: number
  pageCount: number
  totalItems: number
  showingLabel: string
  onPageChange: (page: number) => void
}) {
  return (
    <div className="flex flex-col items-start gap-2 border-t border-[#421d0d]/8 px-3 py-2.5 text-[10px] text-[#8b7569] sm:flex-row sm:items-center sm:justify-between sm:px-4">
      <span>{showingLabel}</span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex size-9 items-center justify-center rounded-md transition-colors hover:bg-[#f7e4d2] disabled:pointer-events-none disabled:opacity-40 sm:size-6"
        >
          <ChevronLeft className="size-3.5" />
        </button>

        <span className="font-medium text-[#421d0d]">
          Page {page} of {Math.max(pageCount, 1)}
        </span>

        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount || totalItems === 0}
          onClick={() => onPageChange(page + 1)}
          className="flex size-9 items-center justify-center rounded-md transition-colors hover:bg-[#f7e4d2] disabled:pointer-events-none disabled:opacity-40 sm:size-6"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
