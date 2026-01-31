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
  PackageIcon,
  Settings02Icon,
  Logout03Icon,
} from "@hugeicons/core-free-icons";
import { signOut } from "@vendly/auth/react";
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
import { useAppSession } from "@/contexts/app-session-context";

export default function Header({ hideSearch = false }: { hideSearch?: boolean }) {
  const { session } = useAppSession();
  const isSignedIn = !!session;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [isTenant, setIsTenant] = useState(false);
  const router = useRouter();

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

  const handleSellNow = () => router.push("/c");
  const showSellButton = !isSignedIn || !isTenant;

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-[#F9F9F7] transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="hidden md:block">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
            <div className="flex items-center gap-2 shrink-0">
              <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
              <span className="text-base font-semibold tracking-tight">vendly</span>
            </div>

            {!hideSearch && <Search />}
            <div className={hideSearch ? "ml-auto" : ""}>
              <Actions
                isMobile={false}
                isSignedIn={isSignedIn}
                session={session}
                setShowLogin={setShowLogin}
                showSellButton={showSellButton}
                handleSellNow={handleSellNow}
              />
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
            </div>
            <Actions
              isMobile={true}
              isSignedIn={isSignedIn}
              session={session}
              setShowLogin={setShowLogin}
              showSellButton={showSellButton}
              handleSellNow={handleSellNow}
            />
          </div>

          {!hideSearch && (
            <div className="px-4 pb-4">
              <div className="relative">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                />
                <Input
                  type="search"
                  id="search-mobile"
                  placeholder="Search products, stores, creators…"
                  className="h-12 pl-10 rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {showLogin && <LoginOverlay onClose={() => setShowLogin(false)} />}
    </>
  );
}

function Actions({
  isMobile,
  isSignedIn,
  session,
  setShowLogin,
  showSellButton,
  handleSellNow
}: {
  isMobile?: boolean;
  isSignedIn: boolean;
  session: any;
  setShowLogin: (v: boolean) => void;
  showSellButton: boolean;
  handleSellNow: () => void;
}) {
  return (
    <div className={`flex items-center gap-4 ${isMobile ? "flex-wrap" : ""}`}>
      {!isSignedIn && (
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

      {isSignedIn && (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className={`${isMobile ? "h-8 w-8" : "h-6 w-6"}`}>
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {session?.user?.name && (
                  <p className="font-medium text-sm">{session.user.name}</p>
                )}
                {session?.user?.email && (
                  <p className="w-[200px] truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                )}
              </div>
            </div>
            <div className="h-px bg-neutral-100 my-1" />
            <DropdownMenuItem>
              <Link href="/account/orders" className="cursor-pointer w-full flex items-center gap-2">
                <HugeiconsIcon icon={PackageIcon} size={16} />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/account/settings" className="cursor-pointer w-full flex items-center gap-2">
                <HugeiconsIcon icon={Settings02Icon} size={16} />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <div className="h-px bg-neutral-100 my-1" />
            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600 focus:text-red-600 flex items-center gap-2">
              <HugeiconsIcon icon={Logout03Icon} size={16} />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Link href="/cart">
        <HugeiconsIcon icon={ShoppingBag02Icon} size={isMobile ? 24 : 24} />
      </Link>
      {showSellButton && (
        <Button onClick={handleSellNow} className={isMobile ? "w-full" : "hidden md:block"}>
          Sell now
        </Button>
      )}
    </div>
  );
}


