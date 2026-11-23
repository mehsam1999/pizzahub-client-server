"use client"

import { ALL_CATEGORIES, MENU_CATEGORIES } from "@/lib/constants/menu"

export function MenuCategoryChips({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="-mx-1 flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:thin] sm:mx-0 sm:pb-0.5">
      <CategoryChip
        label="All Pizzas"
        active={value === ALL_CATEGORIES}
        onClick={() => onChange(ALL_CATEGORIES)}
      />
      {MENU_CATEGORIES.map((category) => (
        <CategoryChip
          key={category}
          label={category}
          active={value === category}
          onClick={() => onChange(category)}
        />
      ))}
    </div>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-8 shrink-0 rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors duration-200 sm:min-h-0 sm:px-2.5 sm:py-1 sm:text-[9px] ${
        active
          ? "bg-[#421d0d] text-white"
          : "bg-[#fdf2e5] text-[#421d0d] hover:bg-[#f7e4d2]"
      }`}
    >
      {label}
    </button>
  )
}
