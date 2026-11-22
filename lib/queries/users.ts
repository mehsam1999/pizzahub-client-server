
"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import type { Role } from "@/lib/auth"

type SearchField = "name" | "email"

type GetUsersParams = {
  searchValue?: string
  searchField?: SearchField
  role?: Role | "all"
  limit?: number
  offset?: number
}

export async function getUsers({
  searchValue = "",
  searchField = "name",
  role = "all",
  limit = 10,
  offset = 0,
}: GetUsersParams = {}) {
  try {
    const requestHeaders = await headers()

    const result = await auth.api.listUsers({
      query: {
        searchValue: searchValue.trim() || undefined,
        searchField,
        searchOperator: "contains",

        filterField: role === "all" ? undefined : "role",
        filterValue: role === "all" ? undefined : role,
        filterOperator: role === "all" ? undefined : "eq",

        limit,
        offset,
        sortBy: "createdAt",
        sortDirection: "desc",
      },
      headers: requestHeaders,
    })

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error("Get users error:", error)

    return {
      success: false,
      message: "Failed to load users.",
      data: null,
    }
  }
}

export async function blockUser(userId: string) {
  try {
    const requestHeaders = await headers()

    await auth.api.banUser({
      body: {
        userId,
        banReason: "Blocked by PizzaHub administrator",
      },
      headers: requestHeaders,
    })

    return {
      success: true,
      message: "User blocked successfully.",
    }
  } catch (error) {
    console.error("Block user error:", error)

    return {
      success: false,
      message: "Failed to block user.",
    }
  }
}

export async function unblockUser(userId: string) {
  try {
    const requestHeaders = await headers()

    await auth.api.unbanUser({
      body: {
        userId,
      },
      headers: requestHeaders,
    })

    return {
      success: true,
      message: "User unblocked successfully.",
    }
  } catch (error) {
    console.error("Unblock user error:", error)

    return {
      success: false,
      message: "Failed to unblock user.",
    }
  }
}
