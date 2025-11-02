"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";

const navigationLinks = [
  { id: "hero", label: "Overview" },
  { id: "how-it-works", label: "How it works" },
  { id: "solutions", label: "Solutions" },
];

export default function NavBar() {
  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="px-4 md:px-6 bg-background/80 backdrop-blur-sm fixed w-full z-50">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px] glow-sync pointer-events-none" />{" "}
      <div className="flex h-16 items-center gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/apple-icon.png"
              alt="vendly logo"
              width={32}
              height={32}
            />
            <span className="font-bold text-foreground">vendly.</span>
          </Link>
        </div>

        {/* Center - Nav links */}
        <div className="flex-1 flex justify-center">
          <NavigationMenu className="max-md:hidden">
            <NavigationMenuList className="gap-6">
              {navigationLinks.map((link) => (
                <NavigationMenuItem key={link.id}>
                  <NavigationMenuLink
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleScroll(link.id);
                    }}
                    className="text-[14px] py-1.5 font-semibold cursor-pointer"
                  >
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="rounded-full px-4 text-sm bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleScroll("cta");
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
