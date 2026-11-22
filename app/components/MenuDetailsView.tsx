
"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Home,
  ChevronRight,
  MapPin,
  Store,
  ShoppingBag,
  BadgeCheck,
} from "lucide-react"

import type { MenuItem } from "@/lib/types/menu"
import { getMenuItemVendorName } from "@/lib/types/menu"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import {
  proccedItemOrder,
  type OrderForm,
} from "@/lib/actions/orders"
import { toast } from "@/components/ui/toast"

export function MenuDetailsView({ menu }: { menu: MenuItem }) {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const [selectedImage, setSelectedImage] = useState(menu.imageUrl)
  const [customerName, setCustomerName] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const galleryImages = [menu.imageUrl, ...(menu.images ?? [])].filter(
    (image, index, self) => image && self.indexOf(image) === index
  )

  const vendorName = getMenuItemVendorName(menu) || "PizzaHub Vendor"

  const price = Number(menu.price) || 0

  const handleMenuOrder = async () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-menus/${menu._id}`)
      return
    }

    if (user.role !== "customer") {
      toast.add({
        title: "Order failed",
        description: "Only customers can place orders.",
        type: "error",
      })
      return
    }

    if (
      !customerName.trim() ||
      !deliveryDate ||
      !deliveryAddress.trim()
    ) {
      toast.add({
        title: "Missing information",
        description: "Please fill in all required fields.",
        type: "error",
      })
      return
    }

    const orders: OrderForm = {
      userId: user.id,
      email: user.email,
      customerName: customerName.trim(),
      menuId: String(menu._id),
      itemName: menu.name,
      imageUrl: menu.imageUrl,
      itemCategory: menu.category,
      vendorId: String(menu.vendorId),
      vendorName,
      deliveryDate,
      deliveryAddress: deliveryAddress.trim(),
      message: message.trim(),
      status: "Pending",
      createdAt: new Date().toISOString(),
    }

    try {
      setIsSubmitting(true)

      const result = await proccedItemOrder(orders)

      if (result.insertedId) {
        toast.add({
          title: "Order placed",
          description: "Your order has been submitted successfully.",
          type: "success",
        })

        router.push("/dashboard/customer/my-orders")
      } else {
        toast.add({
          title: "Order failed",
          description: "Your order could not be placed. Please try again.",
          type: "error",
        })
      }
    } catch (error) {
      console.error("Order submission failed:", error)

      toast.add({
        title: "Order failed",
        description: "Something went wrong. Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fff8f4] text-[#421d0d]">
      {/* Breadcrumb */}
      <div className="border-b border-[#ead9cc] bg-[#fff0e4] px-4 py-3 sm:px-5">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-hidden text-[11px] text-[#78675d]">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-1 hover:text-[#421d0d]"
          >
            <Home size={12} />
            Home
          </Link>

          <ChevronRight size={12} className="shrink-0" />

          <Link href="/browse-menus" className="shrink-0 hover:text-[#421d0d]">
            Browse Menu
          </Link>

          <ChevronRight size={12} className="shrink-0" />

          <span className="truncate font-semibold text-[#421d0d]">
            {menu.name}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[1.35fr_0.95fr] lg:gap-8 lg:py-12">
        {/* Left Side */}
        <section>
          {/* Main Image */}
          <div className="relative aspect-[1.45] overflow-hidden rounded-xl bg-[#f5e6da] shadow-sm">
            <img
              src={selectedImage || menu.imageUrl}
              alt={menu.name}
              className="h-full w-full object-cover"
            />

            <div className="absolute top-3 left-3">
              <span className="rounded-full bg-[#421d0d]/85 px-3 py-1.5 text-[10px] font-medium text-white">
                {menu.category}
              </span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`aspect-[1.35] overflow-hidden rounded-lg border-2 ${
                  selectedImage === image
                    ? "border-[#421d0d]"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={image}
                  alt={`${menu.name} preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Information Cards */}
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <InfoCard
              title="Menu Category"
              value={menu.category}
              description="PizzaHub menu selection"
            />

            <InfoCard
              title="Price"
              value={`$${price.toFixed(2)}`}
              description="Per item"
            />

            <InfoCard
              title="Availability"
              value="Available Item"
              description="Available to order"
            />
          </div>
        </section>

        {/* Right Side */}
        <section className="flex flex-col">
          {/* Title and Price */}
          <div>
            <span className="rounded-full bg-[#f5e6da] px-2.5 py-1 text-[9px] font-medium">
              {menu.category}
            </span>

            <h1 className="mt-2 font-serif text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
              {menu.name}
            </h1>

            <div className="mt-2 flex items-center gap-2">
              <span className="font-serif text-xl font-bold">
                ${price.toFixed(2)}
              </span>

              <span className="text-[10px] text-[#78675d]">
                Per item • Prepared to order
              </span>
            </div>
          </div>

          {/* Vendor Card */}
          <div className="mt-5 rounded-xl bg-[#fbeadd] p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white">
                  <Store size={20} className="text-[#806000]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold tracking-wider text-[#806000] uppercase">
                    Menu Vendor
                  </p>

                  <h3 className="truncate text-sm font-bold">
                    {vendorName}
                  </h3>

                  <p className="text-[10px] text-[#78675d]">
                    Menu provider
                  </p>
                </div>
              </div>

              <span className="flex shrink-0 items-center gap-1 rounded-md bg-white px-3 py-2 text-[9px] font-semibold">
                <BadgeCheck size={13} />
                Verified Menu
              </span>
            </div>

            <div className="mt-3 rounded-lg bg-white/70 p-2.5">
              <p className="flex items-center gap-2 text-[10px] text-[#78675d]">
                <MapPin size={13} className="shrink-0 text-[#806000]" />
                {menu.location}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-[11px] font-semibold tracking-wider text-[#6b5143] uppercase">
              About This Menu
            </h3>

            <p className="mt-2 text-xs leading-[1.9] text-[#59483e]">
              {menu.description ||
                "No description available for this menu item."}
            </p>
          </div>

          {/* Category and Location */}
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-[#fbeadd] p-3">
              <p className="text-[9px] font-medium text-[#806000]">
                CATEGORY
              </p>
              <p className="mt-1 text-xs font-bold">{menu.category}</p>
            </div>

            <div className="rounded-lg bg-[#fbeadd] p-3">
              <p className="text-[9px] font-medium text-[#806000]">
                LOCATION
              </p>
              <p className="mt-1 truncate text-xs font-bold">
                {menu.location}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-auto pt-6">
            <div className="rounded-xl bg-[#fff0e4] p-4">
              <p className="mb-3 text-sm font-bold">Order Summary</p>

              {/* Customer Information */}
              <div className="mb-4 space-y-3">
                {/* Customer Name */}
                <div>
                  <label className="mb-1 block text-xs font-semibold">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-10 w-full rounded-lg border border-[#ead9cc] bg-white px-3 text-base outline-none focus:border-[#806000] sm:text-xs"
                  />
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="mb-1 block text-xs font-semibold">
                    Delivery Date
                  </label>

                  <input
                    type="date"
                    value={deliveryDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#ead9cc] bg-white px-3 text-base outline-none focus:border-[#806000] sm:text-xs"
                  />
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="mb-1 block text-xs font-semibold">
                    Delivery Address
                  </label>

                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    rows={3}
                    className="w-full rounded-lg border border-[#ead9cc] bg-white px-3 py-2 text-base outline-none focus:border-[#806000] sm:text-xs"
                  />
                </div>

                {/* Additional Message */}
                <div>
                  <label className="mb-1 block text-xs font-semibold">
                    Additional Message (Optional)
                  </label>

                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any special instructions?"
                    rows={2}
                    className="w-full rounded-lg border border-[#ead9cc] bg-white px-3 py-2 text-base outline-none focus:border-[#806000] sm:text-xs"
                  />
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-2 border-t border-[#ead9cc] pt-3">
                <div className="flex justify-between text-xs text-[#78675d]">
                  <span>Price per item</span>
                  <span>${price.toFixed(2)}</span>
                </div>

                <div className="flex justify-between border-t border-[#ead9cc] pt-3 text-sm font-bold">
                  <span>Total</span>
                  <span>${price.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to Order */}
              <button
                type="button"
                onClick={handleMenuOrder}
                disabled={isSubmitting}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#ffcc42] px-3 text-center text-[11px] font-bold text-[#421d0d] transition-colors hover:bg-[#f4bb28] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingBag size={14} />
                {isSubmitting ? "Placing Order..." : "Proceed to Order"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function InfoCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-xl bg-[#fbeadd] p-3">
      <p className="text-[9px] font-semibold text-[#806000]">
        {title}
      </p>

      <h3 className="mt-1 text-sm font-bold">{value}</h3>

      <p className="mt-1 text-[9px] text-[#78675d]">
        {description}
      </p>
    </div>
  )
}
