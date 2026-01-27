"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag02Icon,
  Search01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { signOut, useSession } from "@vendly/auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@vendly/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@vendly/ui/components/dropdown-menu";
import { useRouter } from "next/navigation";
import { LoginOverlay } from "@/app/(auth)/login/page";
import Search from "./search";

export default function Header() {
  const { data: session } = useSession();
  const isSignedIn = !!session;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [isTenant, setIsTenant] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/user/status")
        .then((res) => res.json())
        .then((data) => setIsTenant(data.hasTenant))
        .catch(() => setIsTenant(false));
    } else {
      setIsTenant(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(!(currentScrollY > lastScrollY && currentScrollY > 100));
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSellNow = () => router.push("/onboarding");
  const showSellButton = !isSignedIn || !isTenant;

  // Reusable Action Items
 const Actions = ({ isMobile }: { isMobile?: boolean }) => (
  <div className={`flex items-center gap-4 ${isMobile ? "flex-wrap" : ""}`}>
    {/* User / Login */}
    {hasMounted && !isSignedIn && (
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setShowLogin(true);
        }}
      >
        <HugeiconsIcon icon={UserCircleIcon} size={isMobile ? 24 : 22} />
      </Link>
    )}

    {hasMounted && isSignedIn && (
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Avatar className={`${isMobile ? "h-8 w-8" : "h-6 w-6"}`}>
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )}

    {/* Cart */}
    <Link href="/cart">
      <HugeiconsIcon icon={ShoppingBag02Icon} size={isMobile ? 24 : 24} />
    </Link>

    {/* Sell Now */}
    {hasMounted && showSellButton && (
      <Button onClick={handleSellNow} className={isMobile ? "w-full" : "hidden md:block"}>
        Sell now
      </Button>
    )}
  </div>
);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-[#F9F9F7] transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Desktop */}
        <div className="hidden md:block">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
            <div className="flex items-center gap-2 shrink-0">
              <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
              <span className="text-base font-semibold tracking-tight">vendly</span>
            </div>

            <Search />
            <Actions />
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
            </div>
            <Actions isMobile />
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
                className="h-12 pl-10 rounded-md"
              />
            </div>
          </div>
        </div>
      </header>

      {showLogin && <LoginOverlay onClose={() => setShowLogin(false)} />}
    </>
  );
}
