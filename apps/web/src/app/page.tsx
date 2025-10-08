"use client";
import Features from "@/components/Features";
import HeroSection from "@/components/Hero";
import Component from "@/components/NavBar";
import TimelineComponent from "@/components/Timeline";



export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-gray-900">
      <Component />
      <HeroSection />
      <TimelineComponent />
      <Features />
    </main>
  );
}

