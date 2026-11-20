"use client"

import { MapPin, Store } from "lucide-react"
import * as motion from "motion/react-client"

import { cn } from "@/lib/utils"
import { getMenuItemVendorName, type MenuItem } from "@/lib/types/menu"
import {
  fadeUp,
  revealClass,
  staggerContainer,
  viewportOnce,
} from "@/components/homepage/motion-variants"

export function BrowseMenuGrid({ menus }: { menus: MenuItem[] }) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(
        revealClass,
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 xl:grid-cols-4"
      )}
    >
      {menus.map((menu) => (
        <motion.li key={menu._id} variants={fadeUp} className="h-full">
          <MenuCard menu={menu} />
        </motion.li>
      ))}
    </motion.ul>
  )
}

function MenuCard({ menu }: { menu: MenuItem }) {
  const vendorName = getMenuItemVendorName(menu)

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", visualDuration: 0.25, bounce: 0 }}
      className="h-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#421d0d]/8 transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(66,29,13,0.45)]"
    >
      <div className="relative aspect-[1.45] bg-[#fdf2e5]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
          <h2 className="font-serif text-sm font-bold">{menu.name}</h2>
          <span className="shrink-0 text-xs font-bold tabular-nums">
            ${Number(menu.price).toFixed(2)}
          </span>
        </div>
        {vendorName ? (
          <div className="mt-1 flex items-center gap-1.5">
            <Store className="size-3.5 shrink-0 text-[#806000]" />
            <p className="text-[12px] font-medium text-[#806000]">
              {vendorName}
            </p>
          </div>
        ) : null}
        <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-[#78675d]">
          {menu.description}
        </p>
        <p className="mt-2 flex items-center gap-1 text-[10px] text-[#6b5a4e]">
          <span aria-hidden>
            <MapPin size={12} />
          </span>
          {menu.location}
        </p>
        <button
          type="button"
          className="mt-3 h-8 w-full rounded-md bg-[#ffcc42] text-[10px] font-semibold text-[#421d0d] transition-colors hover:bg-[#f4bb28]"
        >
          View Details <span aria-hidden>→</span>
        </button>
      </div>
    </motion.article>
  )
}
