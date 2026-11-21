
import {
  MapPin,
  Tag,
  MessageCircle,
  Store,
  Clock,
  CookingPot,
  CalendarDays,
} from "lucide-react"

import { TableCell, TableRow } from "@/components/ui/table"
import { OrderStatusBadge } from "@/app/components/OrderStatusBadge"
import type { Order } from "@/lib/actions/orders"

export function MyOrderRow({ order }: { order: Order }) {
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
      {/* Desktop and Tablet Table Row */}
      <TableRow className="hidden border-[#421d0d]/8 hover:bg-[#fffaf5] md:table-row">

        {/* Item Image */}
        <TableCell className="px-3 py-4 align-top lg:px-4">
          <div className="size-12 overflow-hidden rounded-lg bg-[#fdf2e5] lg:size-14">
            <img
              src={order.imageUrl}
              alt={order.itemName}
              className="size-full object-cover"
            />
          </div>
        </TableCell>

        {/* Item Information */}
        <TableCell className="py-4 align-top">
          <p className="font-serif text-sm font-semibold text-[#421d0d]">
            {order.itemName}
          </p>

          <div className="mt-2">
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#f7efd7] px-2 py-1.5 text-[9px] font-semibold text-[#8a6a24]">
              <Tag className="size-3 shrink-0" />
              <span className="truncate">{order.itemCategory}</span>
            </span>
          </div>

          {order.message && (
            <div className="mt-2">
              <span className="inline-flex max-w-full items-start gap-1.5 rounded-full bg-[#f3ece2] px-2 py-1.5 text-[9px] font-semibold text-[#6b5a4e]">
                <MessageCircle className="mt-0.5 size-3 shrink-0" />
                <span className="break-words">Note: {order.message}</span>
              </span>
            </div>
          )}
        </TableCell>

        {/* Vendor */}
        <TableCell className="py-4 align-top">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-[#421d0d]">
            <Store className="size-3.5 shrink-0 text-[#8b5a24]" />
            <span className="break-words">{order.vendorName}</span>
          </p>
        </TableCell>

        {/* Delivery Date */}
        <TableCell className="py-4 align-top">
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
        <TableCell className="py-4 align-top">
          <p className="flex items-start gap-1 text-[10px] leading-relaxed text-[#6b5a4e]">
            <MapPin className="mt-0.5 size-3 shrink-0" />
            <span className="break-words">{order.deliveryAddress}</span>
          </p>
        </TableCell>

        {/* Status */}
        <TableCell className="py-4 pr-3 align-top lg:pr-4">
          <OrderStatusBadge status={order.status} />
        </TableCell>
      </TableRow>

      {/* Mobile Order Card */}
      <TableRow className="border-0 hover:bg-transparent md:hidden">
        <TableCell colSpan={6} className="p-2">
          <div className="rounded-xl border border-[#ead9cc] bg-white p-3 shadow-sm">

            {/* Item Header */}
            <div className="flex gap-3">
              <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-[#fdf2e5]">
                <img
                  src={order.imageUrl}
                  alt={order.itemName}
                  className="size-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-serif text-sm font-semibold text-[#421d0d]">
                  {order.itemName}
                </p>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f7efd7] px-2 py-1 text-[9px] font-semibold text-[#8a6a24]">
                    <Tag className="size-3" />
                    {order.itemCategory}
                  </span>

                  {order.message && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f3ece2] px-2 py-1 text-[9px] font-semibold text-[#6b5a4e]">
                      <MessageCircle className="size-3" />
                      Note: {order.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#ead9cc] pt-3">

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

            {/* Address */}
            <div className="mt-3 border-t border-[#ead9cc] pt-3">
              <p className="text-[9px] font-semibold uppercase text-[#8b7569]">
                Delivery Address
              </p>
              <p className="mt-1 flex items-start gap-1.5 text-[11px] leading-relaxed text-[#6b5a4e]">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span>{order.deliveryAddress}</span>
              </p>
            </div>

            {/* Status */}
            <div className="mt-3 flex items-center justify-between border-t border-[#ead9cc] pt-3">
              <span className="text-[10px] font-semibold text-[#8b7569]">
                Order Status
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </TableCell>
      </TableRow>
    </>
  )
}
