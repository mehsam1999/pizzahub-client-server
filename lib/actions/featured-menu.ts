import type { MenuItem } from "@/lib/types/menu"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export async function getFeaturedMenu(): Promise<MenuItem[]> {
  const res = await fetch(`${BASE_URL}/menus?status=Approved&limit=6`)

  if (!res.ok) {
    throw new Error("Failed to fetch menus")
  }

  const menus: MenuItem[] = await res.json()

  return menus
}
