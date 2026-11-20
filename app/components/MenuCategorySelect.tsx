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

export function MenuCategorySelect({
  onChange,
}: {
  onChange?: (value: string) => void
}) {
  return (
    <Select
      onValueChange={(value) => {
        if (typeof value === "string") {
          onChange?.(value)
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
        <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
        {MENU_CATEGORIES.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
