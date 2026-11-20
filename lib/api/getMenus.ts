import type { MenuItem } from "@/lib/types/menu"


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const getMenus = async (query = ''): Promise<MenuItem[]> => {
    const res = await fetch(`${BASE_URL}/menus?${query}`)
    return res.json();
}
