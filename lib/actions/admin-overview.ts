
"use server"

type User = {
  role: string
}

type Menu = {
  status: string
}

export type AdminOverviewData = {
  totalUsers: number
  totalVendors: number
  totalCustomers: number
  totalMenus: number
  pendingMenus: number
  totalTransactions: number
}

export async function getAdminOverview() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

    if (!API_URL) {
      throw new Error("API URL is not configured")
    }

    const [usersResponse, menusResponse, transactionsResponse] =
      await Promise.all([
        fetch(`${API_URL}/users`, { cache: "no-store" }),
        fetch(`${API_URL}/menus`, { cache: "no-store" }),
        fetch(`${API_URL}/payments/transactions`, {
          cache: "no-store",
        }),
      ])

    if (
      !usersResponse.ok ||
      !menusResponse.ok ||
      !transactionsResponse.ok
    ) {
      throw new Error("Failed to fetch dashboard data")
    }

    const users: User[] = await usersResponse.json()
    const menus: Menu[] = await menusResponse.json()
    const transactions = await transactionsResponse.json()

    const data: AdminOverviewData = {
      totalUsers: users.length,

      totalVendors: users.filter(
        (user) => user.role === "vendor"
      ).length,

      totalCustomers: users.filter(
        (user) => user.role === "customer"
      ).length,

      totalMenus: menus.length,

      pendingMenus: menus.filter(
        (menu) => menu.status === "Pending"
      ).length,

      totalTransactions: transactions.length,
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Admin overview error:", error)

    return {
      success: false,
      data: null,
      message: "Failed to load dashboard overview.",
    }
  }
}
