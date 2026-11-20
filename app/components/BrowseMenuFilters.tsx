"use client"

import { MenuCategoryChips } from "./MenuCategoryChips"
import { MenuCategorySelect } from "./MenuCategorySelect"
import { MenuLocationFilter } from "./MenuLocationFilter"
import { MenuPriceSort } from "./MenuPriceSort"
import { MenuSearchFilter } from "./MenuSearchFilter"

export function BrowseMenuFilters({ locations }: { locations: string[] }) {
  
  const handleSearchChange = () => {}
  const handleLocationChange = () => {}
  const handleCategoryChange = () => {}
  const handlePriceSortChange = () => {}

  return (
    <div className="mt-5 rounded-xl bg-white/80 p-2.5 shadow-sm ring-1 ring-[#421d0d]/5">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.4fr)_minmax(0,0.4fr)_minmax(0,0.45fr)]">
        <MenuSearchFilter onChange={handleSearchChange} />
        <MenuLocationFilter
          locations={locations}
          onChange={handleLocationChange}
        />
        <MenuCategorySelect onChange={handleCategoryChange} />
        <MenuPriceSort onChange={handlePriceSortChange} />
      </div>
      <MenuCategoryChips onChange={handleCategoryChange} />
    </div>
  )
}
