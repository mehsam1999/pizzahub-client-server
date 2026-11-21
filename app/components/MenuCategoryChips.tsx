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
    <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-0.5">
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
      className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-medium transition-colors ${
        active
          ? "bg-[#421d0d] text-white"
          : "bg-[#fdf2e5] text-[#421d0d] hover:bg-[#f7e4d2]"
      }`}
    >
      {label}
    </button>
  )
}
