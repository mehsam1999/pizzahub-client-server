import CategorySection from "@/components/homepage/CategorySection"
import FeaturedMenuPage from "@/components/homepage/FeaturedMenu"
import HeroSection from "@/components/homepage/HeroSection"
import HowItWorks from "@/components/homepage/HowItWorks"
import WhyChooseUs from "@/components/homepage/WhyChooseUs"

export default function Page() {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <FeaturedMenuPage />
      <WhyChooseUs />
      <HowItWorks />
    </div>
  )
}
