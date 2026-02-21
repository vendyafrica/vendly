import { FAQ } from "@/components/faq";
import Footer from "@/components/footer";
import { Hero } from "@/components/hero";
import { Header } from "@/components/header";
import { Features } from "@/components/features";
import { TasteTransition } from "@/components/taste-transition";
import { Solutions } from "@/components/solutions";

export default function Home() {
  return (
    <div className="bg-white text-[#0A0A0F]">
      <Header />
      <Hero />
      <TasteTransition />
      <Features />
      <Solutions />
      <FAQ />
      <Footer />
    </div>
  );
}
