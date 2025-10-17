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
  { href: "#", label: "Overview", active: true },
  { href: "#", label: "How it works" },
  { href: "#", label: "Solutions" }, 
];

export default function NavBar() {
  return (
    <header className="px-4 md:px-6 bg-background/80 backdrop-blur-sm border-b border-border">
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
        <div className="flex-1 flex justify-center">
          <NavigationMenu className="max-md:hidden">
            <NavigationMenuList className="gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink
                  
                  href="#"
                  className="text-[14px] py-1.5 font-semibold"
                >
                  Overview
                </NavigationMenuLink>
              </NavigationMenuItem>
              {navigationLinks
                .filter((l) => l.label !== "Overview")
                .map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={link.href}
                      className="text-[14px] py-1.5 font-semibold"
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
          {/* <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full px-4 text-sm"
          >
            <Link href="/login">Login</Link>
          </Button> */}
          <Button
            asChild
            size="sm"
            className="rounded-full px-4 text-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a href="#" className="inline-flex items-center gap-1">
              Get Started
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}