export type MenuStatus = "Approved" | "Pending" | "Rejected"

export type MenuItemForm = {
  name: string
  category: string
  price: number
  description: string
  location: string
  imageUrl: string
  status: MenuStatus
}

export type MenuItem = MenuItemForm & {
  _id: number
}
