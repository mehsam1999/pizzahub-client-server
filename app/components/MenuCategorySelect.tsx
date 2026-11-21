"use client"

import { SlidersHorizontal } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ALL_CATEGORIES, MENU_CATEGORIES } from "@/lib/constants/menu"

const CATEGORY_ITEMS = [
  { value: ALL_CATEGORIES, label: "All Categories" },
  ...MENU_CATEGORIES.map((category) => ({
    value: category,
    label: category,
  })),
]

export function MenuCategorySelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Select
      items={CATEGORY_ITEMS}
      value={value}
      onValueChange={(next) => {
        if (typeof next === "string") {
          onChange(next)
        }
      }}
    >
      <SelectTrigger
        aria-label="Filter by category"
        className="h-9 w-full border-0 bg-[#fdf2e5] text-[10px]"
      >
        <SlidersHorizontal className="size-3.5 text-[#8b7569]" aria-hidden />
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORY_ITEMS.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
