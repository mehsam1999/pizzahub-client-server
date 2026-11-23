
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getMenuCategories } from "@/lib/actions/categories"

const CategorySection = async () => {
  const categories = await getMenuCategories()

  return (
    <section className="bg-[#fff8f2] px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-7 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#9b762c] uppercase">
              Curated Styles
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold text-[#421d0d] sm:text-3xl">
              Explore by Category
            </h2>

            <p className="mt-2 text-xs text-[#78675d] sm:text-sm">
              Something exceptionally delicious for every individual craving
              and dough preference.
            </p>
          </div>

          <Link
            href="/browse-menus"
            className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-[#421d0d] transition hover:text-[#9b762c] sm:flex"
          >
            View All Categories <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, index) => (
            <Link
              key={category}
              href={`/browse-menus?category=${encodeURIComponent(category)}`}
              className="group flex min-h-28 flex-col justify-between rounded-xl border border-[#f0e5dc] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#e5c8b2] hover:shadow-md sm:min-h-32"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-[#fdf2e5] text-[10px] font-bold text-[#9b762c] transition group-hover:bg-[#421d0d] group-hover:text-white">
                {index + 1}
              </span>

              <h3 className="mt-4 font-serif text-sm font-bold leading-snug text-[#421d0d] sm:text-base">
                {category}
              </h3>
            </Link>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-5 flex justify-center sm:hidden">
          <Link
            href="/browse-menus"
            className="flex items-center gap-1 text-xs font-semibold text-[#421d0d]"
          >
            View All Categories <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CategorySection
