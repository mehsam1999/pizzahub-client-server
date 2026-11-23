"use client"

import { AnimatePresence, motion } from "motion/react"
import { MapPin, Store, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { getMenuItemVendorName, type MenuItem } from "@/lib/types/menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Image from "next/image"

const PAGE_SIZE = 6

export function BrowseMenuGrid({ menus }: { menus: MenuItem[] }) {
  const [page, setPage] = useState(1)
  const [menusSnapshot, setMenusSnapshot] = useState(menus)
  let currentPage = page

  if (menusSnapshot !== menus) {
    setMenusSnapshot(menus)
    currentPage = 1
  }

  const pageCount = Math.ceil(menus.length / PAGE_SIZE)
  const pageMenus = menus.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <AnimatePresence mode="wait">
        {menus.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#fdf2e5]">
              <Search className="size-7 text-[#806000]" strokeWidth={1.7} />
            </div>

            <h3 className="font-serif text-lg font-bold text-[#421d0d]">
              No Menus Found
            </h3>

            <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#78675d]">
              We couldn&apos;t find any menus matching your search or filters.
              Try changing your search or clearing the filters.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="menu-grid"
            layout
            className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {pageMenus.map((menu, index) => (
                <MenuCard key={menu._id} menu={menu} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {pageCount > 1 && (
        <Pagination className="mt-8">
          <PaginationContent className="max-w-full flex-wrap justify-center">
            <PaginationItem>
              <PaginationPrevious
                aria-label="Go to previous page"
                disabled={currentPage === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft className="size-4" />
                <span className="hidden sm:inline">Previous</span>
              </PaginationPrevious>
            </PaginationItem>

            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    aria-label={`Go to page ${pageNumber}`}
                    isActive={currentPage === pageNumber}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                aria-label="Go to next page"
                disabled={currentPage === pageCount}
                onClick={() =>
                  setPage((current) => Math.min(pageCount, current + 1))
                }
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="size-4" />
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

function MenuCard({ menu, index }: { menu: MenuItem; index: number }) {
  const router = useRouter()
  const vendorName = getMenuItemVendorName(menu)

  const handleViewDetails = () => {
    router.push(`/browse-menus/${menu._id}`)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.06, 0.3),
        layout: { duration: 0.3 },
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
      className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#421d0d]/8 transition-[box-shadow,transform] duration-300 hover:shadow-lg motion-reduce:transition-none"
    >
      {/* Fixed Image Height */}
      <div className="relative h-48 shrink-0 overflow-hidden bg-[#fdf2e5] sm:h-52">
        <Image
          src={menu.imageUrl}
          alt={menu.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="size-full object-cover"
        />

        <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold text-[#421d0d]">
          {menu.category}
        </span>

        <span className="absolute top-2 right-2 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-semibold text-[#421d0d] shadow-sm sm:text-[10px]">
          <span className="text-[#e4b126]">★</span>{" "}
          {index % 2 ? "4.8 (310)" : "4.9 (420)"}
        </span>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* Menu Name and Price */}
        {/* Menu Name and Price */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
          <h2 className="min-w-0 font-serif text-sm leading-6 font-bold break-words sm:text-base">
            {menu.name}
          </h2>

          <span className="text-xs font-bold whitespace-nowrap tabular-nums">
            ${Number(menu.price).toFixed(2)}
          </span>
        </div>

        {/* Vendor Name */}
        <div className="mt-1 flex min-h-5 items-center gap-1.5">
          {vendorName && (
            <>
              <Store className="size-3.5 shrink-0 text-[#806000]" />
              <p className="truncate text-xs font-medium text-[#806000]">
                {vendorName}
              </p>
            </>
          )}
        </div>

        {/* Description */}
        <p className="mt-2 line-clamp-2 min-h-10 text-[10px] leading-5 text-[#78675d]">
          {menu.description}
        </p>

        {/* Location */}
        <p className="mt-2 mb-2 flex min-h-5 items-center gap-1 text-[10px] text-[#6b5a4e]">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{menu.location}</span>
        </p>

        {/* Button */}
        <button
          type="button"
          onClick={handleViewDetails}
          className="mt-auto h-9 w-full rounded-md bg-[#ffcc42] text-[10px] font-semibold text-[#421d0d] transition-colors hover:bg-[#f4bb28]"
        >
          View Details →
        </button>
      </div>
    </motion.article>
  )
}
