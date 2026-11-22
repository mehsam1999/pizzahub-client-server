
"use client"

import { useState } from "react"

import {
  MapPin,
  Tag,
  MessageCircle,
  Store,
  Clock,
  CookingPot,
  CalendarDays,
  Eye,
  XCircle,
} from "lucide-react"

import { TableCell, TableRow } from "@/components/ui/table"
import { OrderStatusBadge } from "@/app/components/OrderStatusBadge"
import { CancelOrderDialog } from "@/app/components/CancelOrderDialog"
import type { Order } from "@/lib/actions/orders"

type MyOrderRowProps = {
  order: Order
  onView: () => void
  onCancel: () => void
  isCancelling: boolean
}

export function MyOrderRow({
  order,
  onView,
  onCancel,
  isCancelling,
}: MyOrderRowProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const formattedDate = order.deliveryDate
    ? new Date(`${order.deliveryDate}T00:00:00`).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      )
    : "Not specified"

  return (
    <>
      {/* Desktop and Tablet Order Row */}
      <TableRow className="hidden border-[#421d0d]/8 hover:bg-[#fffaf5] xl:table-row">

        {/* Item Image */}
        <TableCell className="w-[100px] px-3 py-4 align-top whitespace-normal lg:px-4">
          <div className="size-12 overflow-hidden rounded-lg bg-[#fdf2e5] lg:size-14">
            <img
              src={order.imageUrl}
              alt={order.itemName}
              className="size-full object-cover"
            />
          </div>
        </TableCell>

        {/* Item Information */}
        <TableCell className="min-w-0 py-4 align-top whitespace-normal">
          <p className="break-words font-serif text-sm font-semibold text-[#421d0d]">
            {order.itemName}
          </p>

          {/* Category and Note */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#f7efd7] px-2 py-1.5 text-[9px] font-semibold text-[#8a6a24]">
              <Tag className="size-3 shrink-0" />
              <span className="break-words">{order.itemCategory}</span>
            </span>

            {order.message && (
              <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#f3ece2] px-2 py-1.5 text-[9px] font-semibold text-[#6b5a4e]">
                <MessageCircle className="size-3 shrink-0" />
                <span className="break-words">Note: {order.message}</span>
              </span>
            )}
          </div>

          {/* View Details */}
          <button
            type="button"
            onClick={onView}
            className="mt-2 inline-flex items-center gap-1 py-1 text-[11px] font-semibold text-[#8b5a24] transition-colors hover:text-[#421d0d] hover:underline sm:py-0 sm:text-[10px]"
          >
            <Eye className="size-3" />
            View Details
          </button>
        </TableCell>

        {/* Vendor */}
        <TableCell className="min-w-0 py-4 align-top whitespace-normal">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-[#421d0d]">
            <Store className="size-3.5 shrink-0 text-[#8b5a24]" />
            <span className="break-words">{order.vendorName}</span>
          </p>
        </TableCell>

        {/* Delivery Date */}
        <TableCell className="min-w-0 py-4 align-top whitespace-normal">
          <p className="text-xs leading-relaxed text-[#421d0d]">
            {formattedDate}
          </p>

          {order.status === "Pending" && (
            <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#8a6a24]">
              <Clock className="size-3.5 shrink-0" />
              Estimated ~25 mins
            </p>
          )}

          {order.status === "Accepted" && (
            <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#6f7a3d]">
              <CookingPot className="size-3.5 shrink-0" />
              In Wood Oven
            </p>
          )}
        </TableCell>

        {/* Delivery Address */}
        <TableCell className="min-w-0 py-4 align-top whitespace-normal">
          <p className="flex items-start gap-1 text-[10px] leading-relaxed text-[#6b5a4e]">
            <MapPin className="mt-0.5 size-3 shrink-0" />
            <span className="break-words">{order.deliveryAddress}</span>
          </p>
        </TableCell>

        {/* Status and Cancel Action */}
        <TableCell className="w-[180px] min-w-[150px] py-4 pr-3 align-top whitespace-normal lg:pr-4">
          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge status={order.status} />

            {order.status === "Pending" && (
              <button
                type="button"
                onClick={() => setShowCancelDialog(true)}
                disabled={isCancelling}
                className="inline-flex max-w-full items-center justify-center gap-1 whitespace-nowrap rounded-md bg-red-600 px-2.5 py-1.5 text-[10px] font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle className="size-3 shrink-0" />
                Cancel Order
              </button>
            )}
          </div>
        </TableCell>
      </TableRow>

      {/* Mobile Order Card */}
      <TableRow className="border-0 hover:bg-transparent xl:hidden">
        <TableCell colSpan={6} className="p-2 align-top whitespace-normal sm:p-3">
          <div className="rounded-xl border border-[#ead9cc] bg-white p-3 shadow-sm sm:p-4">

            {/* Item Header */}
            <div className="flex gap-3">
              <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-[#fdf2e5] sm:size-16">
                <img
                  src={order.imageUrl}
                  alt={order.itemName}
                  className="size-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="break-words font-serif text-sm font-semibold text-[#421d0d]">
                  {order.itemName}
                </p>

                {/* Category and Note */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#f7efd7] px-2 py-1.5 text-[9px] font-semibold text-[#8a6a24]">
                    <Tag className="size-3 shrink-0" />
                    <span>{order.itemCategory}</span>
                  </span>

                  {order.message && (
                    <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#f3ece2] px-2 py-1.5 text-[9px] font-semibold text-[#6b5a4e]">
                      <MessageCircle className="size-3 shrink-0" />
                      <span className="break-words">Note: {order.message}</span>
                    </span>
                  )}
                </div>

                {/* View Details */}
                <button
                  type="button"
                  onClick={onView}
                  className="mt-2 inline-flex items-center gap-1 py-1 text-[11px] font-semibold text-[#8b5a24] transition-colors hover:text-[#421d0d] hover:underline sm:py-0 sm:text-[10px]"
                >
                  <Eye className="size-3" />
                  View Details
                </button>
              </div>
            </div>

            {/* Order Details */}
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#ead9cc] pt-3 sm:grid-cols-2">

              {/* Vendor */}
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase text-[#8b7569]">
                  Vendor
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#421d0d]">
                  <Store className="size-3.5 shrink-0 text-[#8b5a24]" />
                  <span className="break-words">{order.vendorName}</span>
                </p>
              </div>

              {/* Delivery Date */}
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase text-[#8b7569]">
                  Delivery Date
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#421d0d]">
                  <CalendarDays className="size-3.5 shrink-0 text-[#8b5a24]" />
                  <span>{formattedDate}</span>
                </p>

                {order.status === "Pending" && (
                  <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#8a6a24]">
                    <Clock className="size-3.5 shrink-0" />
                    Estimated ~25 mins
                  </p>
                )}

                {order.status === "Accepted" && (
                  <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[#6f7a3d]">
                    <CookingPot className="size-3.5 shrink-0" />
                    In Wood Oven
                  </p>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="mt-3 border-t border-[#ead9cc] pt-3">
              <p className="text-[9px] font-semibold uppercase text-[#8b7569]">
                Delivery Address
              </p>

              <p className="mt-1 flex items-start gap-1.5 text-[11px] leading-relaxed text-[#6b5a4e]">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span className="break-words">{order.deliveryAddress}</span>
              </p>
            </div>

            {/* Status and Cancel Action */}
            <div className="mt-3 flex flex-col gap-2 border-t border-[#ead9cc] pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <OrderStatusBadge status={order.status} />

              {order.status === "Pending" && (
                <button
                  type="button"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={isCancelling}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  <XCircle className="size-3.5" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </TableCell>
      </TableRow>

      {/* Cancel Confirmation Dialog */}
      <CancelOrderDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={() => {
          setShowCancelDialog(false)
          onCancel()
        }}
        isCancelling={isCancelling}
      />
    </>
  )
}
