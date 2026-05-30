import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import MarqueeStrip from "@/components/MarqueeStrip"
import Products from "@/components/Products"
import CustomerReviews from "@/components/CustomerReviews"
import About from "@/components/About"
import Footer from "@/components/Footer"
import SocialProofTicker from "@/components/SocialProofTicker"
import FlashSaleBanner from "@/components/FlashSaleBanner"
import { useTheme } from "@/lib/theme"

export default function Home() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0A1A0F]" : "bg-[#FAF7F2]"} transition-colors duration-300`}>
      <Navbar />
      <Hero />
      <div id="marquee">
        <MarqueeStrip />
      </div>
      <FlashSaleBanner />
      <Products />
      <CustomerReviews />
      <About />
      <Footer />
      <SocialProofTicker />
    </div>
  )
}
