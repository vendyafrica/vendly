import type { Metadata } from "next";
import { FAQ } from "@/components/marketing/faq";
import Footer from "@/components/marketing/footer";
import { Hero } from "@/components/marketing/hero";
import { Header } from "@/components/marketing/header";
import { Features } from "@/components/marketing/features";
import { TasteTransition } from "@/components/marketing/taste-transition";
import { Solutions } from "@/components/marketing/solutions";

export const metadata: Metadata = {
  title: "ShopVendly | Build Your Online Shop from Social Media Posts",
  description:
    "Turn Instagram and TikTok into your online store. Instant storefronts, seamless payments, delivery logistics, and marketplace visibility for African sellers.",
  alternates: {
    canonical: "/",
  },
};

export default function LandingPage() {
  return (
    <div className="bg-[#121214] text-white selection:bg-[#5B4BFF] selection:text-white scroll-smooth">
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
