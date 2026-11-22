
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Search,
  Utensils,
  RefreshCw,
  Eye,
  Check,
  X,
  Clock,
  MapPin,
  Filter,
} from "lucide-react"

import { useSession } from "@/lib/auth-client"
import {
  getAdminMenus,
  updateAdminMenuStatus,
} from "@/lib/actions/admin-menu"

import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { MENU_CATEGORIES } from "@/lib/constants/menu"
import type { MenuItem, MenuStatus } from "@/lib/types/menu"

const PAGE_SIZE = 8

export default function AdminMenuItemsPage() {
  const { data: session, isPending: sessionLoading } = useSession()

  const [menus, setMenus] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [status, setStatus] = useState("All")
  const [page, setPage] = useState(1)

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const isAdmin = session?.user?.role === "admin"

  // Load all menu items
  const loadMenus = useCallback(async () => {
    const result = await getAdminMenus()

    if (result.success) {
      setMenus(result.data)
    } else {
      setMenus([])
      toast.add({
        title: "Could not load menu items",
        description: result.message || "Please try again.",
        type: "error",
      })
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    if (sessionLoading || !isAdmin) return

    let active = true

    const fetchMenus = async () => {
      const result = await getAdminMenus()

      if (!active) return

      if (result.success) {
        setMenus(result.data)
      } else {
        setMenus([])
        toast.add({
          title: "Could not load menu items",
          description: result.message || "Please try again.",
          type: "error",
        })
      }

      setLoading(false)
    }

    void fetchMenus()

    return () => {
      active = false
    }
  }, [sessionLoading, isAdmin])

  // Update item status
  const handleStatusChange = async (
    item: MenuItem,
    newStatus: MenuStatus
  ) => {
    if (!item._id || !item.vendorId || updatingId) return

    setUpdatingId(item._id)

    const result = await updateAdminMenuStatus(
      item._id,
      item.vendorId,
      newStatus
    )

    if (result.success) {
      setMenus((prev) =>
        prev.map((menu) =>
          menu._id === item._id
            ? { ...menu, status: newStatus }
            : menu
        )
      )

      setSelectedItem((prev) =>
        prev?._id === item._id
          ? { ...prev, status: newStatus }
          : prev
      )

      toast.add({
        title: "Status updated",
        description: result.message,
        type: "success",
      })
    } else {
      toast.add({
        title: "Update failed",
        description: result.message || "Please try again.",
        type: "error",
      })
    }

    setUpdatingId(null)
  }

  // Search and filter
  const filteredItems = useMemo(() => {
    return menus.filter((item) => {
      const searchText =
        `${item.name} ${item.description} ${item.vendorName ?? ""} ${item.location}`
          .toLowerCase()

      const matchesSearch = searchText.includes(query.toLowerCase())

      const matchesCategory =
        category === "All" || item.category === category

      const matchesStatus =
        status === "All" || item.status === status

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [menus, query, category, status])

  const pendingCount = menus.filter(
    (item) => item.status === "Pending"
  ).length

  const approvedCount = menus.filter(
    (item) => item.status === "Approved"
  ).length

  const rejectedCount = menus.filter(
    (item) => item.status === "Rejected"
  ).length

  const pageCount = Math.max(
    1,
    Math.ceil(filteredItems.length / PAGE_SIZE)
  )

  const currentPage = Math.min(page, pageCount)

  const pageItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const getStatusStyle = (itemStatus: string) => {
    if (itemStatus === "Approved") {
      return "bg-green-50 text-green-700"
    }

    if (itemStatus === "Rejected") {
      return "bg-red-50 text-red-700"
    }

    return "bg-amber-50 text-amber-700"
  }

  // Loading session
  if (sessionLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-[#eadfd2] border-t-[#421d0d]" />
      </div>
    )
  }

  // Admin authorization
  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-medium text-red-600">
          You are not authorized to access this page.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-[#eadfd2] border-t-[#421d0d]" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#fff8f4] px-3 py-7 text-[#421d0d] sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-[#8b5a24] uppercase">
              <Utensils className="size-3.5" />
              Admin Panel • Menu Moderation
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
              Manage Menu Items
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6b5a4e]">
              Review vendor submissions, approve menu items, and manage
              published listings across PizzaHub.
            </p>
          </div>

          <Button
            onClick={loadMenus}
            className="h-10 gap-2 bg-[#421d0d] text-white hover:bg-[#2f1a0d]"
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#eadfd2] bg-white p-5">
            <p className="text-xs font-medium text-[#8a7565]">
              Total Menu Items
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {menus.length}
            </h2>
          </div>

          <div className="rounded-xl border border-[#eadfd2] bg-white p-5">
            <p className="flex items-center gap-2 text-xs font-medium text-[#8a7565]">
              <Clock className="size-4 text-amber-600" />
              Pending Review
            </p>
            <h2 className="mt-2 text-3xl font-bold text-amber-600">
              {pendingCount}
            </h2>
          </div>

          <div className="rounded-xl border border-[#eadfd2] bg-white p-5">
            <p className="flex items-center gap-2 text-xs font-medium text-[#8a7565]">
              <Check className="size-4 text-green-600" />
              Approved
            </p>
            <h2 className="mt-2 text-3xl font-bold text-green-700">
              {approvedCount}
            </h2>
          </div>

          <div className="rounded-xl border border-[#eadfd2] bg-white p-5">
            <p className="flex items-center gap-2 text-xs font-medium text-[#8a7565]">
              <X className="size-4 text-red-600" />
              Rejected
            </p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {rejectedCount}
            </h2>
          </div>
        </div>

        {/* Pending Review Notice */}
        {pendingCount > 0 && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Clock className="mt-0.5 size-5 shrink-0 text-amber-700" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                {pendingCount} menu item{pendingCount > 1 ? "s" : ""} waiting for review
              </p>
              <p className="mt-1 text-xs text-amber-800">
                Review these vendor submissions and approve or reject them.
              </p>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <section className="mt-6 rounded-xl border border-[#eadfd2] bg-white p-3">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8b7569]" />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                placeholder="Search by item, description, vendor or location..."
                className="h-10 border-0 bg-[#fdf2e5] pl-9 text-xs focus-visible:ring-[#f6c445]"
              />
            </div>

            <Select
              value={category}
              onValueChange={(value) => {
                if (value) {
                  setCategory(value)
                  setPage(1)
                }
              }}
            >
              <SelectTrigger className="h-10 w-full border-0 bg-[#fdf2e5] text-xs lg:w-56">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {MENU_CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={status}
              onValueChange={(value) => {
                if (value) {
                  setStatus(value)
                  setPage(1)
                }
              }}
            >
              <SelectTrigger className="h-10 w-full border-0 bg-[#fdf2e5] text-xs lg:w-40">
                <Filter className="mr-2 size-4" />
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Menu Items Table */}
        <section className="mt-5 overflow-hidden rounded-xl border border-[#eadfd2] bg-white">
          <div className="border-b border-[#eadfd2] p-5">
            <h2 className="font-serif text-lg font-bold">
              Submitted Menu Items
            </h2>
            <p className="mt-1 text-xs text-[#8a7565]">
              View and manage all menu submissions from vendors.
            </p>
          </div>

          {pageItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <Utensils className="size-10 text-[#c5b5a5]" />
              <h3 className="mt-4 font-semibold">
                No Menu Items Found
              </h3>
              <p className="mt-2 text-sm text-[#8a7565]">
                No items match your current search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[950px]">
                <TableHeader className="bg-[#fff1e5]">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-5 text-xs text-[#6b5a4e]">
                      Menu Item
                    </TableHead>
                    <TableHead className="text-xs text-[#6b5a4e]">
                      Vendor
                    </TableHead>
                    <TableHead className="text-xs text-[#6b5a4e]">
                      Category
                    </TableHead>
                    <TableHead className="text-xs text-[#6b5a4e]">
                      Price
                    </TableHead>
                    <TableHead className="text-xs text-[#6b5a4e]">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-xs text-[#6b5a4e]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pageItems.map((item) => (
                    <TableRow
                      key={item._id}
                      className="border-[#421d0d]/5"
                    >
                      <TableCell className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-[#fdf2e5]">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="max-w-[220px]">
                            <p className="truncate text-sm font-semibold">
                              {item.name}
                            </p>
                            <p className="mt-1 truncate text-xs text-[#8a7565]">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="text-sm font-medium">
                          {item.vendorName || "Unknown Vendor"}
                        </p>
                        <p className="mt-1 text-xs text-[#8a7565]">
                          {item.location}
                        </p>
                      </TableCell>

                      <TableCell>
                        <span className="rounded-full bg-[#fdf0e4] px-2.5 py-1 text-[10px] text-[#421d0d]">
                          {item.category}
                        </span>
                      </TableCell>

                      <TableCell className="text-sm font-semibold">
                        ${Number(item.price).toFixed(2)}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold ${getStatusStyle(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            title="View details"
                            onClick={() => setSelectedItem(item)}
                            className="size-8 border-[#eadfd2] text-[#421d0d] hover:bg-[#fdf2e5]"
                          >
                            <Eye className="size-4" />
                          </Button>

                          {item.status !== "Approved" && (
                            <Button
                              size="icon"
                              title="Approve"
                              disabled={updatingId === item._id}
                              onClick={() =>
                                handleStatusChange(item, "Approved")
                              }
                              className="size-8 bg-green-600 text-white hover:bg-green-700"
                            >
                              <Check className="size-4" />
                            </Button>
                          )}

                          {item.status !== "Rejected" && (
                            <Button
                              size="icon"
                              title="Reject"
                              disabled={updatingId === item._id}
                              onClick={() =>
                                handleStatusChange(item, "Rejected")
                              }
                              className="size-8 bg-red-600 text-white hover:bg-red-700"
                            >
                              <X className="size-4" />
                            </Button>
                          )}

                          {item.status !== "Pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={updatingId === item._id}
                              onClick={() =>
                                handleStatusChange(item, "Pending")
                              }
                              className="h-8 border-amber-200 px-2 text-[10px] text-amber-700 hover:bg-amber-50"
                            >
                              Pending
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-[#eadfd2] px-5 py-4 text-xs text-[#8a7565] sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(currentPage * PAGE_SIZE, filteredItems.length)} of{" "}
                {filteredItems.length} items
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                  className="h-8 border-[#eadfd2] text-xs"
                >
                  Previous
                </Button>

                <span className="min-w-16 text-center">
                  Page {currentPage} / {pageCount}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage(currentPage + 1)}
                  className="h-8 border-[#eadfd2] text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Menu Item Details */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-details-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-[#8b5a24] uppercase">
                  Menu Submission Details
                </p>
                <h2
                  id="menu-details-title"
                  className="mt-2 font-serif text-2xl font-bold"
                >
                  {selectedItem.name}
                </h2>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedItem(null)}
                aria-label="Close details"
              >
                <X className="size-5" />
              </Button>
            </div>

            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.name}
              className="mt-5 h-52 w-full rounded-xl object-cover"
            />

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#8a7565]">Vendor</p>
                <p className="mt-1 font-semibold">
                  {selectedItem.vendorName || "Unknown Vendor"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#8a7565]">Price</p>
                <p className="mt-1 font-semibold">
                  ${Number(selectedItem.price).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#8a7565]">Category</p>
                <p className="mt-1 font-semibold">
                  {selectedItem.category}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#8a7565]">Status</p>
                <p className="mt-1 font-semibold">
                  {selectedItem.status}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-[#8a7565]">Location</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                <MapPin className="size-4" />
                {selectedItem.location}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-xs text-[#8a7565]">Description</p>
              <p className="mt-1 text-sm leading-6 text-[#5f4b3e]">
                {selectedItem.description}
              </p>
            </div>

            {selectedItem.images && selectedItem.images.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold text-[#6b5a4e]">
                  Gallery Images
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedItem.images.map((image, index) => (
                    <img
                      key={`${image}-${index}`}
                      src={image}
                      alt={`${selectedItem.name} gallery ${index + 1}`}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-[#eadfd2] pt-5">
              {selectedItem.status !== "Approved" && (
                <Button
                  disabled={updatingId === selectedItem._id}
                  onClick={() =>
                    handleStatusChange(selectedItem, "Approved")
                  }
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Check className="mr-1 size-4" />
                  Approve
                </Button>
              )}

              {selectedItem.status !== "Rejected" && (
                <Button
                  disabled={updatingId === selectedItem._id}
                  onClick={() =>
                    handleStatusChange(selectedItem, "Rejected")
                  }
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  <X className="mr-1 size-4" />
                  Reject
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => setSelectedItem(null)}
                className="border-[#eadfd2]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
