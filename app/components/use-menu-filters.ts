
"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { ALL_CATEGORIES, ALL_LOCATIONS } from "@/lib/constants/menu"

type FilterKey = "search" | "category" | "location" | "sort"

export function useMenuFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read current filter values from URL.
  const search = searchParams.get("search") ?? ""
  const category = searchParams.get("category") || ALL_CATEGORIES
  const location = searchParams.get("location") || ALL_LOCATIONS
  const sort = searchParams.get("sort") ?? ""

  // Update URL while keeping other query parameters.
  const updateFilters = useCallback(
    (updates: Partial<Record<FilterKey, string | null>>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      const query = params.toString()
      const url = query ? `${pathname}?${query}` : pathname

      router.replace(url, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  // Search input.
  const setSearch = (value: string) => {
    updateFilters({ search: value || null })
  }

  // Category filter.
  const setCategory = (value: string) => {
    updateFilters({
      category: value === ALL_CATEGORIES ? null : value,
    })
  }

  // Location filter.
  const setLocation = (value: string) => {
    updateFilters({
      location: value === ALL_LOCATIONS ? null : value,
    })
  }

  // Price sorting.
  const setSort = (value: string) => {
    updateFilters({ sort: value || null })
  }

  // Clear all filters together.
  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete("search")
    params.delete("category")
    params.delete("location")
    params.delete("sort")

    const query = params.toString()
    const url = query ? `${pathname}?${query}` : pathname

    router.replace(url, { scroll: false })
  }

  const hasActiveFilters = Boolean(
    search ||
    category !== ALL_CATEGORIES ||
    location !== ALL_LOCATIONS ||
    sort
  )

  return {
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
  }
}
