"use client";
import Link from "next/link";
import Image from "next/image";
import {  Menu } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Container } from "./container";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full ">
      <Container className="flex justify-center px-0 py-4">
        <div className="flex w-full max-w-5xl items-center gap-4 rounded-full border border-border/60 bg-background/80 px-6 py-3 shadow-md shadow-black/5 backdrop-blur">
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
          <Button className="hidden rounded-full px-6 py-2 text-sm font-semibold shadow-sm shadow-black/10 md:inline-flex">
            Start
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
