import type { MenuItem } from "@/lib/types/menu"


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getMenus = async (query = ''): Promise<MenuItem[]> => {
    const res = await fetch(`${BASE_URL}/menus?${query}`)
    return res.json();
}


export const getMenusById = async (
  menuId: string
): Promise<MenuItem> => {
  const res = await fetch(`${BASE_URL}/menus/${menuId}`)
  return res.json()
}

export const getVendorMenuCount = async (
  vendorId: string
): Promise<number> => {
  const res = await fetch(`${BASE_URL}/menus/count/${vendorId}`)

  if (!res.ok) {
    throw new Error("Failed to fetch vendor menu count")
  }

  const data: { count: number } = await res.json()

  return data.count
}