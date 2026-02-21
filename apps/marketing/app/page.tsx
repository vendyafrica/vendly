import { FAQ } from "@/components/faq";
import Footer from "@/components/footer";
import { Hero } from "@/components/hero";
import { StickyNav } from "@/components/sticky-nav";
import { Contact } from "@/components/contact";
import { Features } from "@/components/features";
import { Pricing } from "@/components/pricing";
import { TasteTransition } from "@/components/taste-transition";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <StickyNav />
      <Hero />
      <TasteTransition />
      <Features />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
