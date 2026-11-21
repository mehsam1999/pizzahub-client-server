"use client"

import { MapPin } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ALL_LOCATIONS } from "@/lib/constants/menu"

export function MenuLocationFilter({
  locations,
  value,
  onChange,
}: {
  locations: string[]
  value: string
  onChange: (value: string) => void
}) {
  const items = [
    { value: ALL_LOCATIONS, label: "All Locations" },
    ...locations.map((location) => ({ value: location, label: location })),
  ]

  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => {
        if (typeof next === "string") {
          onChange(next)
        }
      }}
    >
      <SelectTrigger
        aria-label="Filter by location"
        className="h-9 w-full border-0 bg-[#fdf2e5] text-[10px]"
      >
        <MapPin className="size-3.5 text-[#8b7569]" aria-hidden />
        <SelectValue placeholder="All Locations" />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
