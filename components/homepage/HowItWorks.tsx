import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Step = {
  number: string
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: "01",
    title: "Explore Local Kitchens",
    description:
      "Discover local restaurants and browse their pizza menus with curated photos, verified reviews, and artisan fermentation tags.",
  },
  {
    number: "02",
    title: "Choose & Customize",
    description:
      "Select your favorite pizza, customize your dough style and toppings, and provide your delivery details seamlessly.",
  },
  {
    number: "03",
    title: "Enjoy Piping-Hot",
    description:
      "Follow your order status in real time and enjoy your piping-hot, blistering crust pizza delivered in specialized thermal cases.",
  },
]

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-gradient-to-r from-[#f5dcc8] via-[#fbeee4] to-[#fdf9f4] px-5 py-14 sm:px-6 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-[#b07d3f] uppercase sm:text-xs">
            Simple 3 – Step Journey
          </p>
          <h2
            id="how-it-works-heading"
            className="mt-3 font-serif text-[1.5rem] leading-tight font-bold text-balance text-[#3d2010] sm:text-[2rem] lg:text-[2.125rem]"
          >
            Your Favorite Pizza, Just a Few Steps Away
          </h2>
          <p className="mx-auto mt-2.5 max-w-xl text-sm leading-relaxed text-[#6b5a4e] sm:text-[15px]">
            From artisan ovens straight to your dining table in minutes.
          </p>
        </div>

        {/* Step cards */}
        <ol className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 md:grid-cols-3 md:gap-4 lg:gap-6">
          {steps.map(({ number, title, description }) => (
            <li key={number} className="h-full">
              <Card
                size="sm"
                className="h-full gap-4 rounded-2xl bg-white py-7 text-center ring-1 ring-[#3d2010]/5 shadow-[0_18px_40px_-28px_rgba(61,32,16,0.45)] [--card-spacing:1.375rem] sm:[--card-spacing:1.5rem] sm:py-8 md:[--card-spacing:1.125rem] lg:[--card-spacing:1.5rem]"
              >
                <CardHeader className="gap-4">
                  <span
                    aria-hidden
                    className="mx-auto flex size-10 items-center justify-center rounded-full bg-[#3d2010] font-serif text-[0.8125rem] font-semibold text-[#fdf6e3] sm:size-11 sm:text-sm"
                  >
                    {number}
                  </span>
                  <CardTitle className="w-full font-serif text-[0.95rem] leading-snug font-bold text-balance text-[#3d2010] sm:text-base lg:text-[1.0625rem]">
                    {title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="w-full">
                  <p className="mx-auto max-w-[34ch] text-[0.8125rem] leading-relaxed text-pretty text-[#6b5a4e] sm:text-sm">
                    {description}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default HowItWorks
