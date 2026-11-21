
"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import type { MenuItemForm } from "@/lib/types/menu"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const createMenu = async (data: MenuItemForm) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user || session.user.role !== "vendor") {
    throw new Error("Only authenticated vendors can add menu items")
  }

  const menu = {
    ...data,
    imageUrl: data.imageUrl.trim(),
    images: (data.images ?? []).filter(
      (image) => typeof image === "string" && image.trim() !== ""
    ).map((image) => image.trim()),
    vendorId: session.user.id,
    vendorName: session.user.name?.trim() || session.user.email,
    status: "Pending" as const,
  }

  const res = await fetch(`${BASE_URL}/menus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menu),
  })

  if (!res.ok) {
    throw new Error("Failed to create menu item")
  }

  revalidatePath("/browse-menus")
  return res.json()
}

export const deleteMenu = async (menuId: string) => {
  const res = await fetch(`${BASE_URL}/menus/${menuId}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete menu item")
  }

  revalidatePath("/browse-menus")
  return res.json()
}
