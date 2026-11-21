"use client"

import type { Variants } from "motion/react"

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", visualDuration: 0.5, bounce: 0 },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
}

export const viewportOnce = { once: true, amount: 0.25 } as const
export const revealClass = "motion-reveal"

