
"use server"

export type Transaction = {
  _id?: string
  vendorName: string
  vendorEmail: string
  role: string
  planName: string
  amount: number
  currency: string
  paymentStatus: string
  transactionStatus: string
  transactionDate: string
  sessionId: string
}

export async function getTransactions() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/transactions`,
      { cache: "no-store" }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch transactions")
    }

    const data: Transaction[] = await response.json()

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Get transactions error:", error)

    return {
      success: false,
      data: [] as Transaction[],
      message: "Failed to load transactions.",
    }
  }
}
