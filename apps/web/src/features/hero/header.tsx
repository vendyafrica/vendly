"use client";

import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  ShoppingBasket01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <Link
        href="/"
        className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <Image src="/icon.png" alt="vendly logo" width={32} height={32} />
        <span className="font-medium text-foreground">vendly.</span>
      </Link>
      <div className="flex items-center gap-4 shrink-0  cursor-pointer">
        <HugeiconsIcon icon={FavouriteIcon} className="w-5 h-5" />
        <HugeiconsIcon icon={ShoppingBasket01Icon} className="w-5 h-5" />
        <Button size="sm" className=" cursor-pointer">Sell Now</Button>
        <Button size="sm" className=" cursor-pointer">Login</Button>
      </div>
    </header>
  );
}
