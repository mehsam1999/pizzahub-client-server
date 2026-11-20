import { getMenus } from "@/lib/api/getMenus";

const BrowseMenuPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const search = await searchParams
  const urlSearch = new URLSearchParams(search as Record<string, string>);
  const query = urlSearch.toString()
  console.log("Search params:", search)

  const menus = await getMenus(query)
  return (
    <div>
      <h1>Browse Jobs</h1>
      <ul>
        {
            menus.map((menu)=>(
                <li key={menu._id}>{menu.name}</li>
            ))
        }
      </ul>
    </div>
  )
}

export default BrowseMenuPage
