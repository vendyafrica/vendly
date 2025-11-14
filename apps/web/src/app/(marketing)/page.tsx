"use client";
import Features from "@/components/marketing/Features";
import HeroSection from "@/components/marketing/Hero";
import Waitlist from "@/components/marketing/ContactUs";
import Process from "@/components/marketing/Process";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <HeroSection id="hero" />
      <Process id="how-it-works" />
      <Features id="solutions" />
      <Waitlist id="cta" />
    </main>
  );
}

