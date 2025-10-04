"use client";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "./container";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <Container className="flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="h-6 w-6 rounded-md brand-gradient" />
            <span>Vendly</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground">Features</Link>
            <Link href="#how" className="hover:text-foreground">How it works</Link>
            <Link href="#showcase" className="hover:text-foreground">Showcase</Link>
            <Link href="#pricing" className="hover:text-foreground">Pricing</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden sm:inline-flex">Sign in</Button>
          <Button variant="brand">Get started</Button>
          <button className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </Container>
    </header>
  );
}