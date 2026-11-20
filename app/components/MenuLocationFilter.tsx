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
  onChange,
}: {
  locations: string[]
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
        aria-label="Filter by location"
        className="h-9 w-full border-0 bg-[#fdf2e5] text-[10px]"
      >
        <MapPin className="size-3.5 text-[#8b7569]" aria-hidden />
        <SelectValue placeholder="All Locations" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_LOCATIONS}>All Locations</SelectItem>
        {locations.map((location) => (
          <SelectItem key={location} value={location}>
            {location}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
