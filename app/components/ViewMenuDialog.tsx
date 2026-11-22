
"use client"

import { X } from "lucide-react"
import type { MenuItem } from "@/lib/types/menu"
import { Button } from "@/components/ui/button"

type ViewMenuDialogProps = {
  item: MenuItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewMenuDialog({
  item,
  open,
  onOpenChange,
}: ViewMenuDialogProps) {
  if (!open || !item) return null

  const images = [
    item.imageUrl,
    ...(item.images ?? []),
  ].filter(
    (image, index, array) =>
      image && array.indexOf(image) === index
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-details-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#fffaf6] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#421d0d]/10 px-5 py-4">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.15em] text-[#9a6738] uppercase">
              Artisan Roster
            </p>

            <h2
              id="menu-details-title"
              className="font-serif text-xl font-bold text-[#421d0d]"
            >
              Menu Details
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Close details"
            onClick={() => onOpenChange(false)}
            className="rounded-full text-[#421d0d] hover:bg-[#fdf0e4]"
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="p-5">
          {/* Main Image */}
          <div className="overflow-hidden rounded-xl bg-[#fdf0e4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-64 w-full object-cover sm:h-80"
            />
          </div>

          {/* Additional Images */}
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="h-20 overflow-hidden rounded-lg bg-[#fdf0e4]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`${item.name} ${index + 1}`}
                    className="size-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Name and Price */}
          <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#421d0d]">
                {item.name}
              </h3>

              <p className="mt-1 text-sm text-[#8b7569]">
                {item.category}
              </p>
            </div>

            <p className="text-xl font-bold text-[#9a4d16]">
              ${Number(item.price).toFixed(2)}
            </p>
          </div>

          {/* Description */}
          <div className="mt-4">
            <h4 className="text-xs font-semibold tracking-wide text-[#8b5a24] uppercase">
              Description
            </h4>

            <p className="mt-2 text-sm leading-6 text-[#6b5a4e]">
              {item.description}
            </p>
          </div>

          {/* Information */}
          <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-[#fdf2e5] p-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-medium text-[#8b7569]">
                Category
              </p>
              <p className="mt-1 text-sm font-semibold text-[#421d0d]">
                {item.category}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-medium text-[#8b7569]">
                Location
              </p>
              <p className="mt-1 text-sm font-semibold text-[#421d0d]">
                {item.location || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-medium text-[#8b7569]">
                Price
              </p>
              <p className="mt-1 text-sm font-semibold text-[#421d0d]">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-medium text-[#8b7569]">
                Approval Status
              </p>

              <span
                className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                  item.status === "Approved"
                    ? "bg-[#e8f5e9] text-green-800"
                    : item.status === "Pending"
                      ? "bg-[#fff0c2] text-[#8a6200]"
                      : "bg-[#ffe1df] text-red-800"
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex justify-end">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-[#421d0d] text-white hover:bg-[#63321d]"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
