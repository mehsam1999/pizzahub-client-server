import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"

const HeroSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#1b0e06]">
      {/* Background image */}
      <Image
        src="/banner.png"
        alt="A freshly baked artisan pizza being pulled apart with melted cheese"
        fill
        priority
        sizes="100vw"
        className="object-cover object-left"
      />

      {/* Overlays keep the copy readable on every screen size */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#150a04]/80 via-[#150a04]/70 to-[#150a04]/85 lg:hidden" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-[#150a04]/70 to-[#120802] lg:block" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#150a04] to-transparent lg:hidden" />

      <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-16 sm:min-h-[600px] sm:px-6 sm:py-20 lg:min-h-[640px] lg:px-10 lg:py-24">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* Empty column lets the pizza photography breathe on desktop */}
          <div aria-hidden className="hidden lg:block" />

          <div className="max-w-xl">
            <h1
              className="hero-rise text-[2rem] leading-[0.98] font-extrabold tracking-[-0.02em] text-[#f8f0dc] uppercase min-[420px]:text-[2.4rem] sm:text-[3rem] md:text-[3.6rem] lg:text-[3.05rem] xl:text-[3.85rem]"
              style={{ animationDelay: "0ms" }}
            >
              <span className="block">Crafted with</span>
              <span className="block text-[#f7c445]">Passion.</span>
              <span className="block">Delivered with</span>
              <span className="block text-[#f7c445]">Love.</span>
            </h1>

            <p
              className="hero-rise mt-6 max-w-lg text-[0.95rem] leading-relaxed text-[#efe3cd]/85 sm:text-base md:text-[1.0625rem]"
              style={{ animationDelay: "90ms" }}
            >
              Discover exceptional pizzas from your favorite local restaurants.
              Explore delicious flavors and bring artisan happiness straight to
              your doorstep.
            </p>

            <div
              className="hero-rise mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4"
              style={{ animationDelay: "180ms" }}
            >
              <Link
                href="/menu"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#f7c445] px-6 text-sm font-semibold text-[#231306] shadow-[0_10px_30px_-10px_rgba(247,196,69,0.7)] transition-colors hover:bg-[#ffd45e] focus-visible:ring-3 focus-visible:ring-[#f7c445]/50 focus-visible:outline-none sm:h-13 sm:px-7 sm:text-[15px]"
              >
                Explore Pizza Menu
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <span className="inline-flex h-12 items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-4 text-[12px] font-medium text-[#efe1c9] backdrop-blur-sm sm:h-13 sm:px-5 sm:text-[13px]">
                <Zap className="size-3.5 shrink-0 fill-[#f7c445] text-[#f7c445]" />
                Delivery in 25–35 min &bull; Free over $35
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
