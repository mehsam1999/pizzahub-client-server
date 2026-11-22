"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export function OrderSearchFilter({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative w-full min-w-0 sm:flex-1">
      <Search
        className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#8b7569]"
        aria-hidden
      />
      <Input
        aria-label="Search orders"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Filter by pizza name, artisan flour, or vendor..."
        className="h-10 w-full rounded-lg border border-[#ead9cc] bg-white pl-9 text-base placeholder:text-[#a2907f] focus-visible:border-[#f6c445] focus-visible:ring-[#f6c445]/30 sm:h-9 sm:text-[10px]"
      />
    </div>
  )
}
