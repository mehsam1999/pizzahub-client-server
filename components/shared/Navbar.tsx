"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"

const links = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 border-b border-[#2f1a0d]/10 bg-[#fcf8ee]/95 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-10"
      >
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="text-[1.35rem] leading-none font-extrabold tracking-[-0.03em] text-[#2a1509] transition-opacity hover:opacity-80 md:text-2xl"
        >
          Pizzahub
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                isActive(link.href)
                  ? "bg-[#421d0d] text-[#fdf6e3] shadow-sm"
                  : "text-[#3a2416] hover:bg-[#2f1a0d]/6 hover:text-[#2a1509]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/sign-in"
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-[#3a2416] transition-colors hover:bg-[#2f1a0d]/6 hover:text-[#2a1509]"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-[#f6c445] px-5 py-2.5 text-sm font-semibold text-[#2a1509] transition-colors hover:bg-[#ffd45e] focus-visible:ring-3 focus-visible:ring-[#f6c445]/40 focus-visible:outline-none"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="-mr-1 inline-flex size-10 items-center justify-center rounded-full text-[#2a1509] transition-colors hover:bg-[#2f1a0d]/6 focus-visible:ring-3 focus-visible:ring-[#f6c445]/50 focus-visible:outline-none md:hidden"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        inert={!isOpen}
        className={cn(
          "overflow-hidden border-t border-[#2f1a0d]/10 bg-[#fcf8ee] transition-[max-height,opacity] duration-300 ease-out md:hidden",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 border-t-0 opacity-0"
        )}
      >
        <div className="mx-auto max-w-7xl space-y-1 px-4 pt-3 pb-5 sm:px-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "block rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                isActive(link.href)
                  ? "bg-[#421d0d] text-[#fdf6e3]"
                  : "text-[#3a2416] hover:bg-[#2f1a0d]/6"
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-3 flex items-center gap-2 border-t border-[#2f1a0d]/10 pt-4">
            <Link
              href="/sign-in"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-full border border-[#2f1a0d]/15 px-4 py-2.5 text-center text-sm font-semibold text-[#3a2416] transition-colors hover:bg-[#2f1a0d]/6"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-full bg-[#f6c445] px-4 py-2.5 text-center text-sm font-semibold text-[#2a1509] transition-colors hover:bg-[#ffd45e]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
