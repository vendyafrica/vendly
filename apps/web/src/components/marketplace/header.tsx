"use client";

import Image from "next/image";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  ShoppingCart01Icon,
  Search01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { signInWithGoogle } from "@/lib/auth";

const handleGoogleSignIn = async () => {
  try {
    await signInWithGoogle();
  } catch (error) {
    console.error("Google sign-in failed", error);
  }
};

export default function Header() {
  const isSignedIn = false; // This would come from auth context
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
            <span className="text-base font-semibold tracking-tight">
              vendly
            </span>
          </div>

          {/* Desktop Search */}
          <div className="flex flex-1 justify-center">
            <div className="relative w-full max-w-2xl">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <HugeiconsIcon icon={Search01Icon} size={15} />
              </div>
              <Input
                id="marketplace-search"
                type="search"
                placeholder="Search products, stores, creators…"
                className="h-10 pl-9 pr-4 text-md transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 rounded-full"
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-lg" className="cursor-pointer">
              <HugeiconsIcon icon={FavouriteIcon} size={28} />
            </Button>

            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Cart"
              className="cursor-pointer"
            >
              <HugeiconsIcon icon={ShoppingCart01Icon} size={28} />
            </Button>

            {isSignedIn ? (
              <Button variant="ghost" size="icon-lg" className="cursor-pointer">
                <HugeiconsIcon icon={UserCircleIcon} size={28} />
              </Button>
            ) : (
              <Button
                size="lg"
                className="ml-2 px-5 text-sm font-semibold cursor-pointer"
                onClick={handleGoogleSignIn}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header - Two Row Layout */}
      <div className="md:hidden">
        {/* Top Row: Logo + Actions */}
        <div className="flex items-center justify-between px-4 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
            <span className="text-base font-semibold tracking-tight">vendly</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-lg" className="cursor-pointer">
              <HugeiconsIcon icon={FavouriteIcon} size={24} />
            </Button>

            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Cart"
              className="cursor-pointer"
            >
              <HugeiconsIcon icon={ShoppingCart01Icon} size={24} />
            </Button>

            {isSignedIn ? (
              <Button variant="ghost" size="icon-lg" className="cursor-pointer">
                <HugeiconsIcon icon={UserCircleIcon} size={24} />
              </Button>
            ) : (
              <Button
                size="lg"
                className="px-4 text-sm font-semibold cursor-pointer"
                onClick={handleGoogleSignIn}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Row: Full Width Search - Sticky */}
        <div className="sticky top-0 z-10 bg-white px-4 py-4">
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <HugeiconsIcon icon={Search01Icon} size={18} />
            </div>
            <Input
              type="search"
              placeholder="Search products, stores, creators…"
              className="h-12 pl-10 pr-4 text-md w-full rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
