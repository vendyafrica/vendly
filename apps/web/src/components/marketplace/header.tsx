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
} from "@hugeicons/core-free-icons";
import { SignOut, useSession } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@vendly/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@vendly/ui/components/dropdown-menu";
import { LoginOverlay } from "@/components/ui/overlay";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const isSignedIn = !!session;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
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
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        {/* Desktop */}
        <div className="hidden md:block">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
            {/* Brand */}
            <div className="flex items-center gap-2 shrink-0">
              <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
              <span className="text-base font-semibold tracking-tight">
                vendly
              </span>
            </div>

            {/* Search */}
            <div className="flex flex-1 justify-center">
              <div className="relative w-full max-w-2xl">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <HugeiconsIcon icon={Search01Icon} size={15} />
                </div>
                <Input
                  type="search"
                  placeholder="Search products, stores, creators…"
                  className="h-10 pl-9 rounded-full"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-lg">
                <HugeiconsIcon icon={FavouriteIcon} size={28} />
              </Button>

              <Button variant="ghost" size="icon-lg">
                <HugeiconsIcon icon={ShoppingCart01Icon} size={28} />
              </Button>

              {!isSignedIn && (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setShowLogin(true)}
                  >
                    Sign in
                  </Button>
                  <Link href="/sell">
                    <Button>
                      Sell now
                    </Button>
                  </Link>
                </>
              )}

              {isSignedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session?.user?.image || ""} />
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <Link href="/sell">
                      <DropdownMenuItem onClick={() => SignOut()}>
                        Sell now
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
              <span className="font-semibold">vendly</span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-lg">
                <HugeiconsIcon icon={FavouriteIcon} size={22} />
              </Button>

              <Button variant="ghost" size="icon-lg">
                <HugeiconsIcon icon={ShoppingCart01Icon} size={22} />
              </Button>
              <div className="flex items-center gap-2">
                {!isSignedIn && (
                  <>
                    
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLogin(true)}
                      >
                        Sign in
                      </Button>
                    
                    <Link href="/sell">
                      <Button
                        size="sm"
                    
                      >
                        Sell now
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <Input
                type="search"
                placeholder="Search products, stores, creators…"
                className="h-12 pl-10 rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      {showLogin && <LoginOverlay onClose={() => setShowLogin(false)} />}
    </>
  );
}
