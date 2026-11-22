export type MenuStatus = "Approved" | "Pending" | "Rejected"

export type MenuItemForm = {
  name: string
  category: string
  price: number
  description: string
  location: string
  imageUrl: string
  images?: string[]
  status: MenuStatus
}

export type MenuItem = MenuItemForm & {
  _id: string
  vendorId?: string
  vendorName?: string
  vendor?: { _id?: string; name?: string } | string
}

export function getMenuItemVendorName(item: MenuItem) {
  const name =
    typeof item.vendor === "string"
      ? item.vendor
      : (item.vendor?.name ?? item.vendorName)

  return name?.trim() || undefined
}
