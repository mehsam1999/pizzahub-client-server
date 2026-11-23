import Link from "next/link"
import { Mail } from "lucide-react"

import type { ComponentProps } from "react"

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/browse-menus" },
  { label: "Pizza Categories", href: "/browse-menus" },
]

const accountLinks = [
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
  { label: "My Orders", href: "/dashboard/customer/my-orders" },
]

const legalLinks = [
  { label: "Partner With Us", href: "/partners" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
]

function InstagramIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.55.21.94.47 1.36.89.42.42.68.81.89 1.36.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.21.55-.47.94-.89 1.36-.42.42-.81.68-1.36.89-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.36-.89 3.8 3.8 0 0 1-.89-1.36c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.21-.55.47-.94.89-1.36.42-.42.81-.68 1.36-.89.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 5.68a4.16 4.16 0 1 0 0 8.32 4.16 4.16 0 0 0 0-8.32Zm0 6.86a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm5.29-7.03a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0Z" />
    </svg>
  )
}

function FacebookIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  )
}

function LinkedInIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM3.555 9h3.564v11.452H3.555V9zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const socials = [
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedInIcon },
]

const footerLinkClass =
  "text-[13px] leading-relaxed text-[#bda695] transition-colors hover:text-[#f3e4d4] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#f6c445]/50 focus-visible:outline-none sm:text-sm"

const columnHeadingClass =
  "font-serif text-base font-bold text-[#e9d8c8] sm:text-[1.0625rem]"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-[#3b1c0e] text-[#bda695]">
      <div className="mx-auto max-w-7xl px-5 pt-12 pb-7 sm:px-6 sm:pt-14 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.6fr_1fr_1fr_1.2fr] md:gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="font-serif text-xl font-bold tracking-tight text-[#e9d8c8] transition-colors hover:text-[#f6e4d2] sm:text-[1.375rem]"
            >
              Pizzahub
            </Link>
            <p className="mt-4 max-w-[19rem] text-[13px] leading-relaxed text-[#a48d7c] sm:text-sm md:max-w-none lg:max-w-[19rem]">
              Connecting pizza lovers with exceptional local restaurants.
              Crafted with passion, delivered with love.
            </p>
          </div>

          {/* Explore */}
          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className={columnHeadingClass}>
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className={footerLinkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account */}
          <nav aria-labelledby="footer-account">
            <h2 id="footer-account" className={columnHeadingClass}>
              Account
            </h2>
            <ul className="mt-4 space-y-2.5">
              {accountLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className={footerLinkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact & Legal */}
          <div>
            <h2 className={columnHeadingClass}>Contact &amp; Legal</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="mailto:help@pizzahub.com"
                  className={`${footerLinkClass} inline-flex items-center gap-1.5`}
                >
                  <Mail
                    aria-hidden
                    className="size-3.5 shrink-0 text-[#c9b09b]"
                    strokeWidth={1.75}
                  />
                  help@pizzahub.com
                </a>
              </li>
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className={footerLinkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/10 pt-5 sm:mt-12">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11.5px] leading-relaxed text-[#9c8574] sm:text-xs">
              &copy; {currentYear} PizzaHub. All rights reserved. Handcrafted
              sourdough &amp; wood-fired curation.
            </p>

            <ul className="flex items-center gap-2.5">
              {socials.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex size-8 items-center justify-center rounded-full bg-[#4a2716] text-[#cdb6a4] transition-colors hover:bg-[#5a3220] hover:text-[#f3e4d4] focus-visible:ring-2 focus-visible:ring-[#f6c445]/50 focus-visible:outline-none"
                  >
                    <Icon className="size-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
