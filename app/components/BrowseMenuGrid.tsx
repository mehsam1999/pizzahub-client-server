
"use client"

import { AnimatePresence, motion } from "motion/react"
import { MapPin, Store, Search } from "lucide-react"

import {
  getMenuItemVendorName,
  type MenuItem,
} from "@/lib/types/menu"

export function BrowseMenuGrid({ menus }: { menus: MenuItem[] }) {
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
              <Search
                className="size-7 text-[#806000]"
                strokeWidth={1.7}
              />
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
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {menus.map((menu, index) => (
                <MenuCard
                  key={menu._id}
                  menu={menu}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuCard({
  menu,
  index,
}: {
  menu: MenuItem
  index: number
}) {
  const vendorName = getMenuItemVendorName(menu)

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
      className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#421d0d]/8 transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[1.45] bg-[#fdf2e5]">
        <img
          src={menu.imageUrl}
          alt={menu.name}
          className="size-full object-cover"
        />

        <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold text-[#421d0d]">
          {menu.category}
        </span>

        <span className="absolute right-2 bottom-2 rounded-full bg-[#421d0d]/85 px-2 py-1 text-[9px] text-white">
          ★ 4.8
        </span>
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-serif text-sm font-bold">
            {menu.name}
          </h2>

          <span className="shrink-0 text-xs font-bold tabular-nums">
            ${Number(menu.price).toFixed(2)}
          </span>
        </div>

        {vendorName && (
          <div className="mt-1 flex items-center gap-1.5">
            <Store className="size-3.5 shrink-0 text-[#806000]" />
            <p className="text-[12px] font-medium text-[#806000]">
              {vendorName}
            </p>
          </div>
        )}

        <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-[#78675d]">
          {menu.description}
        </p>

        <p className="mt-2 flex items-center gap-1 text-[10px] text-[#6b5a4e]">
          <MapPin size={12} />
          {menu.location}
        </p>

        <button
          type="button"
          className="mt-3 h-8 w-full rounded-md bg-[#ffcc42] text-[10px] font-semibold text-[#421d0d] transition-colors hover:bg-[#f4bb28]"
        >
          View Details →
        </button>
      </div>
    </motion.article>
  )
}
