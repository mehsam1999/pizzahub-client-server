import { BrowseMenuGrid } from "@/app/components/BrowseMenuGrid"
import { BrowseMenuHeader } from "@/app/components/BrowseMenuHeader"
import { getMenus } from "@/lib/api/getMenus"

const BrowseMenuPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const search = await searchParams
  const urlSearch = new URLSearchParams(search as Record<string, string>)
  const query = urlSearch.toString()

  const menus = (await getMenus(query)).filter(
    (menu) => menu.status === "Approved"
  )
  const locations = [...new Set(menus.map((menu) => menu.location))].sort()

  return (
    <main className="min-h-screen bg-[#fff8f4] text-[#421d0d]">
      <BrowseMenuHeader locations={locations} />
      <BrowseMenuGrid menus={menus} />
    </main>
  )
}

export default BrowseMenuPage
