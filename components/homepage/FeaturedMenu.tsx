import Image from "next/image"
import Link from "next/link"
import { CalendarDays, MapPin } from "lucide-react"
import * as motion from "motion/react-client"

import { getFeaturedMenu } from "@/lib/actions/featured-menu"
import { getMenuItemVendorName } from "@/lib/types/menu"
import {
  fadeUp,
  revealClass,
  staggerContainer,
  viewportOnce,
} from "./motion-variants"

const FeaturedMenuPage = async () => {
  const menus = await getFeaturedMenu()

  return (
    <section className="bg-gradient-to-r from-[#f5dcc8] via-[#fbeee4] to-[#fdf9f4] px-4 py-10 text-[#3d2010] sm:px-6 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className={`${revealClass} mb-6 sm:mb-8`}
        >
          <motion.p variants={fadeUp} className="text-[10px] font-bold tracking-[0.18em] text-[#9b762c] uppercase">
            Daily Selections
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-2 font-serif text-3xl leading-tight font-bold sm:text-4xl">
            Discover Our Favorites
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-2 max-w-xl text-xs leading-relaxed text-[#6b5a4e] sm:text-sm">
            Handpicked wood-fired pizzas and savory bites from award-winning
            partner kitchens across your neighborhood.
          </motion.p>
        </motion.div>

        {menus.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className={`${revealClass} grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5`}
          >
            {menus.slice(0, 6).map((menu, index) => {
              const vendorName = getMenuItemVendorName(menu) || "PizzaHub Kitchen"

              return (
                <motion.article
                  variants={fadeUp}
                  key={menu._id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#3d2010]/5 transition-shadow duration-200 hover:shadow-lg"
                >
                  <Link
                    href={`/browse-menus/${menu._id}`}
                    aria-label={`View ${menu.name} details`}
                    className="group relative block aspect-[1.65] overflow-hidden bg-[#f5e6da] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#9b6b4e]"
                  >
                    <Image
                      src={menu.imageUrl}
                      alt={menu.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 max-w-[70%] truncate rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-semibold text-[#421d0d] shadow-sm sm:text-[10px]">
                      {menu.category}
                    </span>
                    <span className="absolute top-2 right-2 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-semibold text-[#421d0d] shadow-sm sm:text-[10px]">
                      <span className="text-[#e4b126]">★</span> {index % 2 ? "4.8 (310)" : "4.9 (420)"}
                    </span>
                  </Link>

                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="min-w-0 font-serif text-sm leading-snug font-bold sm:text-base">
                        {menu.name}
                      </h3>
                      <span className="shrink-0 text-xs font-bold tabular-nums sm:text-sm">
                        ${Number(menu.price).toFixed(2)}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-2 min-h-9 text-[10px] leading-relaxed text-[#78675d] sm:text-[11px]">
                      {menu.description}
                    </p>

                    <p className="mt-2 flex min-w-0 items-center gap-1.5 text-[9px] font-medium text-[#6b5a4e] sm:text-[10px]">
                      <CalendarDays className="size-3 shrink-0 text-[#806000]" />
                      <span className="min-w-0 truncate">{vendorName}</span>
                      <span aria-hidden>•</span>
                      <MapPin className="size-3 shrink-0 text-[#806000]" />
                      <span className="min-w-0 truncate">{menu.location}</span>
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#f0e3d9] pt-2.5">
                      <span className="text-[9px] text-[#78675d] sm:text-[10px]">
                        ◷ 25–35 min
                      </span>
                      <Link
                        href={`/browse-menus/${menu._id}`}
                        className="inline-flex min-h-8 items-center justify-center rounded-lg bg-[#ffcc42] px-3 text-[9px] font-semibold text-[#421d0d] transition-colors hover:bg-[#f4bb28] sm:text-[10px]"
                      >
                        View Details ›
                      </Link>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        ) : (
          <p className="rounded-xl bg-white/70 px-4 py-8 text-center text-sm text-[#78675d]">
            No featured menu items are available right now.
          </p>
        )}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className={`${revealClass} mt-7 flex justify-center sm:mt-9`}
        >
          <Link
            href="/browse-menus"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#3d2010] px-6 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#5a321c] sm:px-8 sm:text-sm"
          >
            Explore Entire Artisan Menu <span className="ml-2" aria-hidden>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedMenuPage
