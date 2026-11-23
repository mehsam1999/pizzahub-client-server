"use server"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export async function getMenuCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/menus/categories`)

  if (!res.ok) {
    throw new Error("Failed to fetch menu categories")
  }

  const categories: string[] = await res.json()

  return categories
}
