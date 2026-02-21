"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    let last = false;

    const update = () => {
      rafId = null;
      const next = window.scrollY > 24;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };

    const onScroll = () => {
      if (rafId != null) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId != null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0F]/85 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 flex items-center justify-between h-[78px]">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <Image
            src="/vendly.png"
            alt="Vendly logo"
            width={36}
            height={36}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-9 translate-x-8">
          {["Product", "Solutions", "Pricing", "About"].map((label) => (
            <Link
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-sm font-extrabold tracking-[0.24em] uppercase text-white/90 hover:text-white hover:underline underline-offset-[6px] decoration-2 decoration-white transition-all py-2"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <Link
            href="https://duuka.store/onboarding"
            className="hidden md:inline-flex items-center justify-center text-[12px] font-extrabold tracking-[0.2em] uppercase text-white bg-[#5B4BFF] hover:bg-[#7B6EFF] rounded-full px-6 py-3 transition-all shadow-lg shadow-[#5B4BFF]/30"
          >
            Get Started
          </Link>
          <Link
            href="https://duuka.store/login"
            className="hidden md:inline-block text-[12px] font-extrabold tracking-[0.2em] uppercase text-white border border-white/30 hover:border-white/60 rounded-full px-5 py-2.5 transition-all"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
