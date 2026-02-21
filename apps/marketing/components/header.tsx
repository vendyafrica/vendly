"use client";

import Link from "next/link";
import { Anton } from "next/font/google";
import { useState, useEffect } from "react";

const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap" });

const navLinks = ["Product", "Solutions", "Pricing", "About"];

export function Header() {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 78);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change / resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
      >
        <div className="mx-auto max-w-[1400px] px-5 md:px-12 flex items-center justify-between h-[68px] md:h-[78px]">
          {/* Logo */}
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 translate-x-8">
            {navLinks.map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-(--white)/90 hover:text-(--white) hover:underline underline-offset-[6px] decoration-2 decoration-(--white) transition-all py-1.5"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="https://duuka.store/onboarding"
              className="inline-flex items-center justify-center text-[10px] font-extrabold tracking-[0.2em] uppercase text-(--white) border border-(--white)/60 hover:border-(--white) rounded-full px-5 py-2.5 transition-all hover:bg-(--white) hover:text-(--ink)"
            >
              Get Started
            </Link>
            <Link
              href="https://duuka.store/login"
              className="text-[10px] font-extrabold tracking-[0.18em] uppercase text-(--white) hover:underline underline-offset-[6px] decoration-2 decoration-(--white) transition-all py-1.5"
            >
              Sign in
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 shrink-0"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span
              className={`block h-[2px] w-5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
            />
            <span
              className={`block h-[2px] w-5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-[2px] w-5 bg-white rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />
        {/* Drawer */}
        <nav
          className={`absolute top-0 right-0 h-full w-[75vw] max-w-[300px] bg-[#0A0A0F]/95 backdrop-blur-xl flex flex-col px-6 pt-20 pb-8 gap-2 transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {navLinks.map((label) => (
            <Link
              key={label}
              href={`#${label.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-white/80 hover:text-white py-3.5 border-b border-white/10 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="https://duuka.store/onboarding"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center justify-center text-[11px] font-extrabold tracking-[0.2em] uppercase text-white border border-white/60 rounded-full px-5 py-3 transition-all hover:bg-white hover:text-[#0A0A0F]"
            >
              Get Started
            </Link>
            <Link
              href="https://duuka.store/login"
              onClick={() => setMenuOpen(false)}
              className="text-center text-[11px] font-extrabold tracking-[0.18em] uppercase text-white/70 hover:text-white py-2 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
