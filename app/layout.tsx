import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import MotionProvider from "@/components/motion-provider"
import { cn } from "@/lib/utils"
import Navbar from "@/components/shared/Navbar"
import SiteFooter from "@/components/shared/SiteFooter"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        playfair.variable,
        "font-sans",
        jakarta.variable
      )}
    >
      <body className="flex min-h-screen flex-col">
        <ThemeProvider>
          <MotionProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
