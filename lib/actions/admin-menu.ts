
"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import type { MenuItem, MenuStatus } from "@/lib/types/menu"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

// Get all menu items for admin
export async function getAdminMenus() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || session.user.role !== "admin") {
      return {
        success: false,
        message: "Unauthorized access",
        data: [] as MenuItem[],
      }
    }

    const response = await fetch(`${BASE_URL}/menus`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch menu items")
    }

    const data: MenuItem[] = await response.json()

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Get admin menus error:", error)

    return {
      success: false,
      message: "Failed to load menu items",
      data: [] as MenuItem[],
    }
  }
}

// Update menu item status
export async function updateAdminMenuStatus(
  menuId: string,
  vendorId: string,
  status: MenuStatus
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || session.user.role !== "admin") {
      return {
        success: false,
        message: "Unauthorized access",
      }
    }

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return {
        success: false,
        message: "Invalid menu status",
      }
    }

    const response = await fetch(`${BASE_URL}/menus/${menuId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendorId,
        status,
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      const result = await response.json().catch(() => null)

      return {
        success: false,
        message: result?.message || "Failed to update menu status",
      }
    }

    revalidatePath("/dashboard/admin/menu-items")
    revalidatePath("/browse-menus")

    return {
      success: true,
      message: `Menu item ${status.toLowerCase()} successfully`,
    }
  } catch (error) {
    console.error("Update admin menu status error:", error)

    return {
      success: false,
      message: "Failed to update menu status",
    }
  }
}
