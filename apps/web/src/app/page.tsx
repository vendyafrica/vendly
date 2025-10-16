"use client";
import Features from "@/components/Features";
import HeroSection from "@/components/Hero";
import Component from "@/components/NavBar";
import TimelineComponent from "@/components/Process";
import  Waitlist from "@/components/CTA";
import Footer from "@/components/Footer";
import Process from "@/components/Process";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-gray-900">
      <Component />
      <HeroSection />
      <Process />
      <Features />
      <Waitlist />
      <Footer />
    </main>
  );
}

