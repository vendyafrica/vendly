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
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm" : "bg-white/70"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4 md:px-16 lg:px-24">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-gray-900 transition-opacity hover:opacity-80"
        >
          <Image src="/icon0.svg" alt="Vendly" width={32} height={32} />
          <span>Vendly</span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-gray-700 lg:flex">
          <Link href="#products" className="text-gray-700/80 hover:text-gray-900">
            Products
          </Link>
          <Link href="#solutions" className="text-gray-700/80 hover:text-gray-900">
            Solutions
          </Link>
          <Link href="#developers" className="text-gray-700/80 hover:text-gray-900">
            Developers
          </Link>
          <Link href="#resources" className="text-gray-700/80 hover:text-gray-900">
            Resources
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="hidden text-gray-700 hover:bg-gray-100 lg:inline-flex"
          >
            Sign in
          </Button>
          <Button
            className="group rounded-full bg-black px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-black/90 hover:shadow-lg"
          >
            Contact Sales
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <button className="inline-flex h-10 w-10 items-center justify-center text-gray-900 lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
