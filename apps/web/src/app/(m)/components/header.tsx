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
import { AppSession, useAppSession } from "@/contexts/app-session-context";
import { useCart } from "@/contexts/cart-context";

export default function Header({ hideSearch = false }: { hideSearch?: boolean }) {
  const { session } = useAppSession();
  const { itemCount } = useCart();
  const isSignedIn = !!session;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [tenantState, setTenantState] = useState(false);
  const [isLoadingTenant, setIsLoadingTenant] = useState(isSignedIn); // Start loading if signed in
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) return;

    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/user/status");
        const data = await res.json();
        if (!cancelled) setTenantState(!!data.hasTenant);
      } catch {
        if (!cancelled) setTenantState(false);
      } finally {
        if (!cancelled) setIsLoadingTenant(false);
      }
    };

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  // If session changes to null, stop loading
  useEffect(() => {
    if (!isSignedIn) setIsLoadingTenant(false);
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
  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  const isTenant = isSignedIn && tenantState;
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
              <Link href="/" className="flex items-center gap-2">
                <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
                <span className="text-base font-semibold tracking-tight">vendly</span>
              </Link>
            </div>

            {!hideSearch && <Search />}
            <div className={hideSearch ? "ml-auto" : ""}>
              <Actions
                isMobile={false}
                isSignedIn={isSignedIn}
                session={session}
                setShowLogin={setShowLogin}
                showSellButton={showSellButton}
                isLoading={isLoadingTenant}
                itemCount={itemCount}
                handleSellNow={handleSellNow}
                handleSignOut={handleSignOut}
              />
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="px-4 pb-4 space-y-3 border-b border-neutral-200">
            <div className="flex items-center justify-between pt-4">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
                <span className="text-base font-semibold tracking-tight">vendly</span>
              </Link>
              <Actions
                isMobile={true}
                isSignedIn={isSignedIn}
                session={session}
                setShowLogin={setShowLogin}
                showSellButton={showSellButton}
                isLoading={isLoadingTenant}
                itemCount={itemCount}
                handleSellNow={handleSellNow}
                handleSignOut={handleSignOut}
                renderSellButton={false}
              />
            </div>

            {!isLoadingTenant && showSellButton && (
              <Button onClick={handleSellNow} className="w-full">
                Sell now
              </Button>
            )}

            {!hideSearch && (
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
            )}
          </div>
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
  isLoading,
  itemCount,
  handleSellNow,
  handleSignOut,
  renderSellButton = true,
}: {
  isMobile?: boolean;
  isSignedIn: boolean;
  session: AppSession | null;
  setShowLogin: (v: boolean) => void;
  showSellButton: boolean;
  isLoading: boolean;
  itemCount: number;
  handleSellNow: () => void;
  handleSignOut: () => Promise<void>;
  renderSellButton?: boolean;
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
          <DropdownMenuTrigger
            className="outline-none"
            id={isMobile ? "actions-menu-trigger-mobile" : "actions-menu-trigger-desktop"}
          >
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
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600 flex items-center gap-2">
              <HugeiconsIcon icon={Logout03Icon} size={16} />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Link href="/cart" className="relative">
        <HugeiconsIcon icon={ShoppingBag02Icon} size={isMobile ? 24 : 24} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white ring-2 ring-white">
            {itemCount}
          </span>
        )}
      </Link>
      {!isLoading && showSellButton && renderSellButton && (
        <Button onClick={handleSellNow} className={isMobile ? "w-full" : "hidden md:block"}>
          Sell now
        </Button>
      )}
    </div>
  );
}


