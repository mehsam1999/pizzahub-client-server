"use client"

import { Utensils } from "lucide-react"
import * as motion from "motion/react-client"

import { cn } from "@/lib/utils"
import {
  fadeUp,
  revealClass,
  staggerContainer,
} from "@/components/homepage/motion-variants"

import { BrowseMenuFilters } from "./BrowseMenuFilters"

export function BrowseMenuHeader({ locations }: { locations: string[] }) {
  return (
    <section className="bg-[#fff1df] px-3 py-5 sm:px-8 sm:py-8">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={cn(revealClass, "mx-auto max-w-7xl")}
      >
        <motion.p
          variants={fadeUp}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#f5e4c6] px-2.5 py-1 text-[9px] font-semibold tracking-wide text-[#785319] uppercase"
        >
          <Utensils className="size-3" aria-hidden />
          Displaying approved &amp; active menu items only
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="mt-3 font-serif text-3xl leading-tight font-bold sm:text-4xl"
        >
          Curated Artisan Menu
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="mt-1 max-w-2xl text-xs leading-relaxed text-[#78675d] sm:text-sm"
        >
          Explore hand-tossed sourdoughs, wood-fired heritage crusts, and
          seasonal Italian specialties baked to order across verified local
          kitchens.
        </motion.p>
        <motion.div variants={fadeUp}>
          <BrowseMenuFilters locations={locations} />
        </motion.div>
      </motion.div>
    </section>
  )
}
