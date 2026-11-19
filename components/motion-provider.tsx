"use client"

import { MotionConfig } from "motion/react"

const MotionProvider = ({ children }: { children: React.ReactNode }) => {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

export default MotionProvider
