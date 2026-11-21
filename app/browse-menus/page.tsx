import { BrowseMenuGrid } from "@/app/components/BrowseMenuGrid"
import { BrowseMenuHeader } from "@/app/components/BrowseMenuHeader"
import { getMenus } from "@/lib/api/getMenus"
import { ALL_CATEGORIES, ALL_LOCATIONS } from "@/lib/constants/menu"
import type { MenuItem } from "@/lib/types/menu"

const approvedOnly = (menus: MenuItem[]) =>
  menus.filter((menu) => menu.status === "Approved")

const BrowseMenuPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) => {
  const search = await searchParams

  const urlSearch = new URLSearchParams()

  Object.entries(search).forEach(([key, value]) => {
    if (typeof value === "string" && value) {
      urlSearch.set(key, value)
    }
  })

  // Remove default filter values.
  if (urlSearch.get("category") === ALL_CATEGORIES) {
    urlSearch.delete("category")
  }

  if (urlSearch.get("location") === ALL_LOCATIONS) {
    urlSearch.delete("location")
  }

  const query = urlSearch.toString()

  // Fetch location options without applying the selected location.
  const locationSearch = new URLSearchParams(urlSearch)
  locationSearch.delete("location")

  const locationQuery = locationSearch.toString()

  const [menus, locationSource] = await Promise.all([
    getMenus(query),
    getMenus(locationQuery),
  ])

  // console.log("Total menus:", menus.length)
  // console.log("Approved menus:", approvedOnly(menus).length)

  // Generate location options from approved menus.
  const locations = [
    ...new Set(
      approvedOnly(locationSource).map((menu) => menu.location)
    ),
  ]
    .filter(Boolean)
    .sort()

  return (
    <main className="min-h-screen bg-[#fff8f4] text-[#421d0d]">
      <BrowseMenuHeader locations={locations} />
      <BrowseMenuGrid menus={approvedOnly(menus)} />
    </main>
  )
}

export default BrowseMenuPage