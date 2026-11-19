"use client"

import type { LucideIcon } from "lucide-react"
import { MousePointerClick, Store, Tag, Truck } from "lucide-react"
import * as motion from "motion/react-client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  fadeUp,
  revealClass,
  staggerContainer,
  viewportOnce,
} from "./motion-variants"

type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Store,
    title: "Discover Local Restaurants",
    description:
      "Explore different pizza restaurants and discover delicious local favorites curated by culinary experts with passion.",
  },
  {
    icon: Tag,
    title: "Something for Every Taste",
    description:
      "Find classic, vegetarian, specialty pizzas, sides, and beverages crafted for every palate and dietary lifestyle.",
  },
  {
    icon: MousePointerClick,
    title: "Simple Ordering",
    description:
      "Browse menus, explore details, customize crusts and toppings, and place orders conveniently without friction.",
  },
  {
    icon: Truck,
    title: "Track Your Orders",
    description:
      "Stay informed about your pizza's preparation, oven firing, and courier route through your account in real-time.",
  },
]

const WhyChooseUs = () => {
  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-us-heading"
      className="bg-[#fefaf5] px-5 py-14 sm:px-6 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className={cn(revealClass, "mx-auto max-w-2xl text-center")}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-semibold tracking-[0.18em] text-[#b07d3f] uppercase sm:text-xs"
          >
            The PizzaHub Standard
          </motion.p>
          <motion.h2
            variants={fadeUp}
            id="why-choose-us-heading"
            className="mt-3 font-serif text-[1.75rem] leading-tight font-bold text-[#3d2010] sm:text-4xl"
          >
            Why Choose PizzaHub?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#6b5a4e] sm:text-[15px]"
          >
            The gold standard in curated local pizza delivery. We partner
            exclusively with craft kitchens adhering to authentic fermentation
            and premium ingredient standards.
          </motion.p>
        </motion.div>

        {/* Feature cards */}
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className={cn(
            revealClass,
            "mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
          )}
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.li key={title} variants={fadeUp} className="h-full">
              <Card
                size="sm"
                className="h-full gap-5 rounded-2xl bg-[#fdf2e5] py-6 text-card-foreground ring-1 ring-[#e8d3ba]/50 transition-shadow duration-300 hover:shadow-[0_18px_40px_-28px_rgba(61,32,16,0.45)] [--card-spacing:1.25rem] sm:[--card-spacing:1.5rem]"
              >
                <CardHeader className="gap-4">
                  <span
                    aria-hidden
                    className="flex size-9 items-center justify-center rounded-lg bg-[#f6c445] sm:size-10"
                  >
                    <Icon
                      className="size-[18px] text-[#3d2010] sm:size-5"
                      strokeWidth={2}
                    />
                  </span>
                  <CardTitle className="font-serif text-[0.95rem] leading-[1.3] font-bold text-[#3d2010] sm:text-base lg:text-[1.0625rem]">
                    {title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-[0.8125rem] leading-relaxed text-[#6b5a4e] sm:text-sm">
                    {description}
                  </p>
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

export default WhyChooseUs
