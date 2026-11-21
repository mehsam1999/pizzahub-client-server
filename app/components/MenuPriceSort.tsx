"use client"

import { ArrowUpDown } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PRICE_SORT_OPTIONS } from "@/lib/constants/menu"

export function MenuPriceSort({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Select
      items={PRICE_SORT_OPTIONS}
      value={value || null}
      onValueChange={(next) => {
        if (typeof next === "string") {
          onChange(next)
        }
      }}
    >
      <SelectTrigger
        aria-label="Sort by price"
        className="h-9 w-full border-0 bg-[#fdf2e5] text-[10px]"
      >
        <ArrowUpDown className="size-3.5 text-[#8b7569]" aria-hidden />
        <SelectValue placeholder="Sort by price" />
      </SelectTrigger>
      <SelectContent>
        {PRICE_SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
