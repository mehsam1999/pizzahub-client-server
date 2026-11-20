"use client"

import { ALL_CATEGORIES, MENU_CATEGORIES } from "@/lib/constants/menu"

export function MenuCategoryChips({
  onChange,
}: {
  onChange?: (value: string) => void
}) {
  return (
    <div className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5">
      <button
        type="button"
        onClick={() => onChange?.(ALL_CATEGORIES)}
        className="shrink-0 rounded-full bg-[#421d0d] px-2.5 py-1 text-[9px] font-medium text-white"
      >
        All Pizzas
      </button>
      {MENU_CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange?.(category)}
          className="shrink-0 rounded-full bg-[#fdf2e5] px-2.5 py-1 text-[9px] font-medium text-[#421d0d] transition-colors hover:bg-[#f7e4d2]"
        >
          {category}
        </button>
      ))}
    </div>
  )
}
