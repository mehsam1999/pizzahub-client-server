"use client"

import { X } from "lucide-react"

import { MenuCategoryChips } from "./MenuCategoryChips"
import { MenuLocationFilter } from "./MenuLocationFilter"
import { MenuPriceSort } from "./MenuPriceSort"
import { MenuSearchFilter } from "./MenuSearchFilter"
import { useMenuFilters } from "./use-menu-filters"

export function BrowseMenuFilters({ locations }: { locations: string[] }) {
  const {
    search,
    category,
    location,
    sort,
    hasActiveFilters,
    setSearch,
    setCategory,
    setLocation,
    setSort,
    clearFilters,
  } = useMenuFilters()

  return (
    <div className="mt-5 rounded-xl bg-white/80 p-2.5 shadow-sm ring-1 ring-[#421d0d]/5 sm:p-3">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.4fr)_minmax(0,0.45fr)]">
        <MenuSearchFilter value={search} onChange={setSearch} />

        <MenuLocationFilter
          locations={locations}
          value={location}
          onChange={setLocation}
        />

        <MenuPriceSort value={sort} onChange={setSort} />
      </div>

      <div className="mt-2 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <MenuCategoryChips value={category} onChange={setCategory} />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 self-start rounded-md bg-[#fdf2e5] px-3 text-[10px] font-medium text-[#421d0d] transition-colors duration-200 hover:bg-[#f7e4d2] sm:h-8 sm:self-auto"
          >
            <X className="size-3.5" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}
