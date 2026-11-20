"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Eye, Pencil, Plus, Search, Trash2, Utensils } from "lucide-react"

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
import type { MenuItemForm } from "./new/page"
import { getMenus } from "@/lib/api/getMenus"

const CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
] as const

type MenuItem = MenuItemForm & {
  id: number
  status: "Approved" | "Pending" | "Rejected"
}

const menus: MenuItem[] = await getMenus()

const PAGE_SIZE = 6

export default function MyMenuItemsPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)

  const filteredItems = useMemo(
    () =>
      menus.filter((item) => {
        const matchesQuery = `${item.name} ${item.description}`
          .toLowerCase()
          .includes(query.toLowerCase())

        return (
          matchesQuery &&
          (category === "all" || item.category === category) &&
          (status === "all" || item.status === status)
        )
      }),
    [query, category, status]
  )

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  return (
    <main className="min-h-screen bg-[#fff8f4] px-3 py-7 text-[#421d0d] sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-[#8b5a24] uppercase">
          <Utensils className="size-3.5" aria-hidden />
          Artisan Roster • Master Inventory
        </p>

        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          My Menu Items
        </h1>

        <p className="mt-1 max-w-xl text-xs leading-5 text-[#6b5a4e] sm:text-sm">
          Manage and curate your artisan culinary catalog. Only approved and
          active dishes appear to customers on PizzaHub.
        </p>

        <div className="mt-5 flex flex-col gap-2 rounded-xl bg-white p-2.5 shadow-sm sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8b7569]"
              aria-hidden
            />
            <Input
              aria-label="Search menu items"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Search dishes by name or ingredient..."
              className="h-10 rounded-lg border-0 bg-[#fdf2e5] pl-9 text-xs placeholder:text-[#8b7569] focus-visible:ring-[#f6c445]"
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
            <SelectTrigger
              aria-label="Filter by category"
              className="h-10 w-full rounded-lg border-0 bg-[#fdf2e5] text-xs sm:w-40"
            >
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((item) => (
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
            <SelectTrigger
              aria-label="Filter by status"
              className="h-10 w-full rounded-lg border-0 bg-[#fdf2e5] text-xs sm:w-36"
            >
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Link
            href="/dashboard/vendor/menu-items/new"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#ffcc42] px-4 text-xs font-medium text-[#421d0d] transition-colors hover:bg-[#f4bb28]"
          >
            <Plus className="size-4" />
            Add New Menu Item
          </Link>
        </div>

        <section
          aria-label="Menu items"
          className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#421d0d]/5"
        >
          <Table className="min-w-[760px] table-fixed">
            <TableHeader className="bg-[#fff1e5]">
              <TableRow className="border-0 hover:bg-transparent">
                <TableHead className="w-14 px-4 py-3 text-[9px] font-semibold tracking-wide text-[#6b5a4e] uppercase">
                  Item
                </TableHead>
                <TableHead className="w-[48%] py-3 text-[9px] font-semibold tracking-wide text-[#6b5a4e] uppercase">
                  Heritage dish &amp; description
                </TableHead>
                <TableHead className="w-40 py-3 text-[9px] font-semibold tracking-wide text-[#6b5a4e] uppercase">
                  Category
                </TableHead>
                <TableHead className="w-20 py-3 text-[9px] font-semibold tracking-wide text-[#6b5a4e] uppercase">
                  Price
                </TableHead>
                <TableHead className="w-28 py-3 text-[9px] font-semibold tracking-wide text-[#6b5a4e] uppercase">
                  Approval status
                </TableHead>
                <TableHead className="w-28 px-4 py-3 text-right text-[9px] font-semibold tracking-wide text-[#6b5a4e] uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageItems.map((item) => (
                <TableRow
                  key={item.id}
                  className={`border-[#421d0d]/5 ${item.status === "Rejected" ? "opacity-60" : ""}`}
                >
                  <TableCell className="px-4 py-2.5">
                    <div className="size-10 overflow-hidden rounded-lg bg-[#fdf2e5]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="size-full object-cover"
                      />
                    </div>
                  </TableCell>

                  <TableCell className="max-w-0 py-2.5">
                    <p className="truncate font-serif text-sm font-bold text-[#421d0d]">
                      {item.name}
                    </p>
                    <p
                      className={`mt-0.5 truncate text-[10px] ${item.status === "Rejected" ? "text-red-600" : "text-[#78675d]"}`}
                    >
                      {item.description}
                    </p>
                  </TableCell>

                  <TableCell className="py-2.5">
                    <span className="inline-block max-w-full truncate rounded-full bg-[#fdf0e4] px-2 py-1 text-[9px] leading-3 whitespace-nowrap text-[#421d0d]">
                      {item.category}
                    </span>
                  </TableCell>

                  <TableCell className="py-2.5 text-xs font-bold tabular-nums">
                    ${Number(item.price).toFixed(2)}
                  </TableCell>

                  <TableCell className="py-2.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium ${item.status === "Approved" ? "bg-[#f4e8da]" : item.status === "Pending" ? "bg-[#fff3cd]" : "bg-[#ffe1df] text-red-800"}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${item.status === "Approved" ? "bg-[#f6c445]" : item.status === "Pending" ? "bg-[#d89d00]" : "bg-red-600"}`}
                      />
                      {item.status}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-2.5">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`View ${item.name}`}
                        className="size-8 rounded-md bg-[#fdf0e4] hover:bg-[#f7e4d2]"
                      >
                        <Eye className="size-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${item.name}`}
                        className="size-8 rounded-md bg-[#fdf0e4] hover:bg-[#f7e4d2]"
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${item.name}`}
                        className="size-8 rounded-md bg-[#fdf0e4] text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {pageItems.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-28 text-center text-sm text-[#78675d]"
                  >
                    No menu items match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-3 border-t border-[#421d0d]/5 px-4 py-3 text-[10px] text-[#78675d] sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing{" "}
              {filteredItems.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} to{" "}
              {Math.min(currentPage * PAGE_SIZE, filteredItems.length)} of{" "}
              {filteredItems.length} items
            </span>

            <nav
              aria-label="Pagination"
              className="flex items-center gap-1 self-end sm:self-auto"
            >
              <Button
                variant="ghost"
                size="icon"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="size-8"
              >
                ‹
              </Button>

              {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant="ghost"
                    aria-current={
                      currentPage === pageNumber ? "page" : undefined
                    }
                    onClick={() => setPage(pageNumber)}
                    className={`size-8 rounded-md p-0 text-[10px] ${currentPage === pageNumber ? "bg-[#421d0d] text-white hover:bg-[#421d0d] hover:text-white" : ""}`}
                  >
                    {pageNumber}
                  </Button>
                )
              )}

              <Button
                variant="ghost"
                size="icon"
                aria-label="Next page"
                disabled={currentPage === pageCount}
                onClick={() => setPage(currentPage + 1)}
                className="size-8"
              >
                ›
              </Button>
            </nav>
          </div>
        </section>
      </div>
    </main>
  )
}
