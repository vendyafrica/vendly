import { BackgroundPattern } from "@/components/background-pattern";
import { FAQ } from "@/components/faq";
import { FeaturesComparison } from "@/components/features-comparison";
import Footer from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Contact } from "@/components/contact";
import { Features } from "@/components/features";

  
export default function Home() {
  return (
    <div>
      <div className="relative bg-primary/4">
        <Navbar />
        <Hero />
        <BackgroundPattern />
      </div>
      <Features />
      {/* <Pricing /> */}
      <FeaturesComparison />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
