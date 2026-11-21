
import { notFound } from "next/navigation"

import { getMenusById } from "@/lib/api/getMenus"
import { MenuDetailsView } from "@/app/components/MenuDetailsView"

const MenuDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  const menu = await getMenusById(id)

  

  if (!menu ) {
    notFound()
  }

  return <MenuDetailsView menu={menu} />
}

export default MenuDetailsPage
