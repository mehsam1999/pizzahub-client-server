const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export type OrderStatus = "Pending" | "Accepted" | "Rejected" | "Cancelled"

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


export const proccedItemOrder = async (data: OrderForm) => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()

    throw new Error(
      error.message || "Failed to place order"
    )
  }

  return res.json()
}


export const getCustomerOrders = async (userId: string): Promise<Order[]> => {
  const res = await fetch(`${BASE_URL}/orders?userId=${userId}`)
  if (!res.ok) {
    throw new Error("Failed to cancel order")
  }

  return res.json()
}

export const cancelCustomerOrder = async (orderId: string, userId: string) => {
  const res = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  })

  if (!res.ok) {
    throw new Error("Failed to cancel order")
  }

  return res.json()
}
