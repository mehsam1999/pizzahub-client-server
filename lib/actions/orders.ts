
"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Cancelled"

export type OrderForm = {
  userId: string
  email: string
  customerName: string
  menuId: string
  itemName: string
  imageUrl: string
  itemCategory: string
  vendorId: string
  vendorName: string
  deliveryDate: string
  deliveryAddress: string
  message?: string
  status: OrderStatus
  createdAt: string
}

export type Order = OrderForm & {
  _id: string
}

// Customer places an order
export const proccedItemOrder = async (data: OrderForm) => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.message || "Failed to place order")
  }

  return result
}

// Get customer orders
export const getCustomerOrders = async (
  userId: string
): Promise<Order[]> => {
  const res = await fetch(
    `${BASE_URL}/orders?userId=${encodeURIComponent(userId)}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch customer orders")
  }

  return res.json()
}

// Cancel customer order
export const cancelCustomerOrder = async (
  orderId: string,
  userId: string
) => {
  const res = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.message || "Failed to cancel order")
  }

  return result
}

// Get orders belonging to the logged-in vendor
export const getVendorOrders = async (): Promise<Order[]> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user || session.user.role !== "vendor") {
    throw new Error("Only vendors can view customer orders")
  }

  const res = await fetch(
    `${BASE_URL}/orders/vendor/${encodeURIComponent(session.user.id)}`,
    { cache: "no-store" }
  )

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch vendor orders")
  }

  return result
}

// Vendor accepts or rejects a pending order
export const updateVendorOrderStatus = async (
  orderId: string,
  status: "Accepted" | "Rejected"
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user || session.user.role !== "vendor") {
    throw new Error("Only vendors can update customer orders")
  }

  const res = await fetch(
    `${BASE_URL}/orders/${orderId}/vendor-status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendorId: session.user.id,
        status,
      }),
    }
  )

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.message || "Unable to update order")
  }

  revalidatePath("/dashboard/vendor/customer-orders")

  return result
}
