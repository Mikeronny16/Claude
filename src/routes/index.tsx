import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/sinar/Navbar";
import { Hero } from "@/components/sinar/Hero";
import { Features } from "@/components/sinar/Features";
import { Products } from "@/components/sinar/Products";
import { About } from "@/components/sinar/About";
import { HowToOrder } from "@/components/sinar/HowToOrder";
import { DeliveryBanner } from "@/components/sinar/DeliveryBanner";
import { Social } from "@/components/sinar/Social";
import { Footer } from "@/components/sinar/Footer";
import { FloatingMessenger } from "@/components/sinar/FloatingMessenger";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useReveal();
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Products />
        <About />
        <HowToOrder />
        <DeliveryBanner />
        <Social />
      </main>
      <Footer />
      <FloatingMessenger />
    </div>
  );
}
