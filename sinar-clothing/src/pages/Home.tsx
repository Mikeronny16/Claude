import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import MarqueeStrip from "@/components/MarqueeStrip"
import Products from "@/components/Products"
import About from "@/components/About"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-forest">
      <Navbar />
      <Hero />
      <div id="marquee">
        <MarqueeStrip />
      </div>
      <Products />
      <About />
      <Footer />
    </div>
  )
}
