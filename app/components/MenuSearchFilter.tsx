"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

export function MenuSearchFilter({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative min-w-0">
      <Search
        className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#8b7569]"
        aria-hidden
      />
      <Input
        aria-label="Search menus"
        placeholder="Search artisan pizzas by name or ingredient..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 border-0 bg-[#fdf2e5] pl-9 text-[10px] placeholder:text-[#8b7569] focus-visible:ring-[#f6c445]"
      />
    </div>
  )
}
