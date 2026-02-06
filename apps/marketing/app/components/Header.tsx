"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";
import { cn } from "@vendly/ui/lib/utils";

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Company", href: "#company" },
];

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-black/5"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/vendly.png"
                alt="Vendly"
                width={36}
                height={36}
                priority
              />
            </Link>

            {/* Desktop nav */}
            <ul className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="default">Get Started</Button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="lg:hidden"
            >
              <HugeiconsIcon icon={open ? Cancel01Icon : Menu01Icon} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            open ? "max-h-[400px]" : "max-h-0"
          )}
        >
          <div className="mx-auto max-w-6xl px-6 pb-6">
            <ul className="space-y-4 pt-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block text-base text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-3">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="default">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
