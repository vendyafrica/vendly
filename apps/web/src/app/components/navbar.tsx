"use client";
import Link from "next/link";
import Image from "next/image";
import {  Menu } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Container } from "./container";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <Container className="flex justify-center px-0 py-6">
        <div className="flex w-full max-w-6xl items-center gap-6 rounded-full border border-white/20 bg-white/80 px-8 py-4 shadow-lg shadow-black/5 backdrop-blur-md">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-foreground transition-colors hover:text-foreground/80"
          >
            <Image src="/icon0.svg" alt="Vendly" width={32} height={32} />
            <span>Vendly</span>
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-8 text-base font-medium text-muted-foreground md:flex">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how"
              className="transition-colors hover:text-foreground"
            >
              Setup
            </Link>
            <Link
              href="#showcase"
              className="transition-colors hover:text-foreground"
            >
              Store
            </Link>
            <Link
              href="#contact"
              className="flex items-center gap-1 transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </nav>
          <Button
            variant="brand"
            className="hidden rounded-full px-8 py-3 text-sm font-bold shadow-lg shadow-purple-500/20 transition-all hover:shadow-xl hover:shadow-purple-500/30 md:inline-flex"
          >
            Get Started
          </Button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </Container>
    </header>
  );
}
