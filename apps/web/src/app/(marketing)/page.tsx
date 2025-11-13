"use client";
import Features from "@/components/marketing/Features";
import HeroSection from "@/components/marketing/Hero";
import Component from "@/components/marketing/NavBar";
import  Waitlist from "@/components/marketing/CTA";
import Footer from "@/components/marketing/Footer";
import Process from "@/components/marketing/Process";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-gray-900">
      <Component />
      <HeroSection id="hero" />
      <Process id="how-it-works" />
      <Features id="solutions" />
      <Waitlist id="cta" />
      <Footer />
    </main>
  );
}

