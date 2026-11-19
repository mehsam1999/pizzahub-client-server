"use client"

import type { Variants } from "motion/react"

/** Entrance used for blocks and cards: a short fade with a small rise. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", visualDuration: 0.5, bounce: 0 },
  },
}

/** Parent variant that walks its children in. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
}

/** Fire once, when a quarter of the section is on screen. */
export const viewportOnce = { once: true, amount: 0.25 } as const

/**
 * Applied to animated wrappers. Motion renders `initial="hidden"` into the
 * server HTML, so this restores content when scripting is unavailable.
 */
export const revealClass = "motion-reveal"

