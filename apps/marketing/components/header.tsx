"use client";

import Link from "next/link";
import { Anton } from "next/font/google";
import { useState, useEffect } from "react";

const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap" });

export function Header() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 78); // hide after scrolling past header height
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 flex items-center justify-between h-[78px]">
        <Link href="/" className="flex items-center gap-1 group shrink-0">
          <span
            className={`${anton.className} text-[20px] leading-none text-(--white)`}
          >
            shop
          </span>
          <span
            className="text-[18px] font-bold leading-none text-(--brand) -ml-[2px]"
            style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
          >
            Vendly
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 translate-x-8">
          {["Product", "Solutions", "Pricing", "About"].map((label) => (
            <Link
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-(--white)/90 hover:text-(--white) hover:underline underline-offset-[6px] decoration-2 decoration-(--white) transition-all py-1.5"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-5">
          <Link
            href="https://duuka.store/onboarding"
            className="hidden md:inline-flex items-center justify-center text-[10px] font-extrabold tracking-[0.2em] uppercase text-(--white) border border-(--white)/60 hover:border-(--white) rounded-full px-5 py-2.5 transition-all hover:bg-(--white) hover:text-(--ink)"
          >
            Get Started
          </Link>
          <Link
            href="https://duuka.store/login"
            className="hidden md:inline-block text-[10px] font-extrabold tracking-[0.18em] uppercase text-(--white) hover:underline underline-offset-[6px] decoration-2 decoration-(--white) transition-all py-1.5"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
