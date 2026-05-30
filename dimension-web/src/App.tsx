import { LangProvider } from "./lib/lang"
import Navbar from "./components/Navbar"
import HeroSection from "./sections/HeroSection"
import ZeroDSection from "./sections/ZeroDSection"
import OneDSection from "./sections/OneDSection"
import TwoDSection from "./sections/TwoDSection"
import ThreeDSection from "./sections/ThreeDSection"
import FourDSection from "./sections/FourDSection"
import "./index.css"

function EndSection() {
  return (
    <section className="min-h-[50vh] flex flex-col items-center justify-center text-center px-8 relative" style={{ background: "linear-gradient(180deg,#000008 0%,#050020 100%)" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="relative z-10">
        <p className="font-mono text-xs tracking-[0.5em] text-white/30 mb-4">BEYOND 4D</p>
        <h2 className="font-orbitron text-3xl sm:text-5xl font-black text-white mb-4">
          5D, 6D, ∞D?
        </h2>
        <p className="font-mm text-white/50 text-base sm:text-lg max-w-lg mx-auto mb-8">
          သိပ္ပံပညာရှင်များသည် String Theory တွင် 10D ထိ၊ M-Theory တွင် 11D ထိ ရှိသည်ဟု ယုံကြည်ကြသည်။ ဦးနှောက်ဆက်ကျဲပါဆဲ? 🤯
        </p>
        <div className="flex items-center justify-center gap-2 font-mono text-xs text-white/20">
          <span>0D</span><span className="text-[#C0C0FF]">→</span>
          <span className="text-[#00F5FF]">1D</span><span className="text-[#00F5FF]">→</span>
          <span className="text-[#A855F7]">2D</span><span className="text-[#A855F7]">→</span>
          <span className="text-[#FF1F6E]">3D</span><span className="text-[#FF1F6E]">→</span>
          <span className="text-[#FFD700]">4D</span><span className="text-[#FFD700]">→</span>
          <span className="text-white/40">∞</span>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <LangProvider>
      <Navbar />
      <HeroSection />
      <ZeroDSection />
      <OneDSection />
      <TwoDSection />
      <ThreeDSection />
      <FourDSection />
      <EndSection />
    </LangProvider>
  )
}
