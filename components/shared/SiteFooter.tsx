"use client"

import { usePathname } from "next/navigation"

import Footer from "./Footer"

const HIDE_ON = ["/dashboard"]

const SiteFooter = () => {
  const pathname = usePathname()

  const hidden = HIDE_ON.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  if (hidden) return null

  return <Footer />
}

export default SiteFooter
