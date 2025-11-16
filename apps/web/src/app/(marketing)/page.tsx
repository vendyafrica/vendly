"use client";
import Features from "@/app/(marketing)/components/Features";
import HeroSection from "@/app/(marketing)/components/Hero";
import Waitlist from "@/app/(marketing)/components/ContactUs";
import Process from "@/app/(marketing)/components/Process";

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
