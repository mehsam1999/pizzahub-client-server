import { MenuItemForm } from "@/app/dashboard/vendor/menu-items/new/page"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const createMenu = async (data: MenuItemForm) => {
  const res = await fetch(`${BASE_URL}/menus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const deleteMenu = async (menuId: string) => {
  const res = await fetch(`${BASE_URL}/menus/${menuId}`, {
    method: "DELETE",
  })

  return res.json()
}
