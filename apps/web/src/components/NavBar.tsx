import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";


// Primary links for both desktop and mobile (except the Compare dropdown)
const navigationLinks = [
  { href: "#", label: "Overview", active: true },
  { href: "#", label: "How it works" },
  { href: "#", label: "What you get" },
];

export default function Component() {
  return (
    <header className="px-4 md:px-6 bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center gap-4">
        {/* Left - Logo + Mobile menu */}
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
                aria-label="Toggle menu"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-44 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0">
                  <NavigationMenuItem className="w-full">
                    <NavigationMenuLink href="#" className="py-1.5">
                      Overview
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {navigationLinks
                    .filter((l) => l.label !== "Overview")
                    .map((link, index) => (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink href={link.href} className="py-1.5">
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover> */}

          <a
            href="#"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/apple-icon.png"
              alt="vendly logo"
              width={32}
              height={32}
            />
            <span className="font-semibold text-gray-900">vendly.</span>
          </a>
        </div>

        {/* Center - Desktop navigation */}
        <div className="flex-1 flex justify-center">
          <NavigationMenu className="max-md:hidden">
            <NavigationMenuList className="gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink
                  active
                  href="#"
                  className="text-gray-700 hover:text-gray-900 py-1.5 font-medium transition-colors"
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
                      className="text-gray-700 hover:text-gray-900 py-1.5 font-medium transition-colors"
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
            asChild
            variant="outline"
            size="sm"
            className="rounded-full px-4 text-sm"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full px-4 text-sm bg-gray-900 text-white hover:bg-gray-800"
          >
            <a href="#" className="inline-flex items-center gap-1">
              Get Started <span aria-hidden>↗</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
