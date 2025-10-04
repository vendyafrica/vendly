"use client";
import Link from "next/link";
import Image from "next/image";
import { Menu, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/10 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4 md:px-16 lg:px-24">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-white transition-opacity hover:opacity-80"
        >
          <Image src="/icon0.svg" alt="Vendly" width={32} height={32} className="brightness-0 invert" />
          <span>Vendly</span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-white/90 lg:flex">
          <Link href="#products" className="transition-opacity hover:opacity-100 hover:text-white">
            Products
          </Link>
          <Link href="#solutions" className="transition-opacity hover:opacity-100 hover:text-white">
            Solutions
          </Link>
          <Link href="#developers" className="transition-opacity hover:opacity-100 hover:text-white">
            Developers
          </Link>
          <Link href="#resources" className="transition-opacity hover:opacity-100 hover:text-white">
            Resources
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="hidden text-white hover:bg-white/10 lg:inline-flex"
          >
            Sign in
          </Button>
          <Button
            className="group rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-lg"
          >
            Contact Sales
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <button className="inline-flex h-10 w-10 items-center justify-center text-white lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
