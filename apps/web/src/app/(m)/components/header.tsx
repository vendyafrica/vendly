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
  MenuIcon,
  FavouriteIcon,
  Cancel01Icon,
  ArrowRight01Icon,
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
import { useCart } from "@/contexts/cart-context";
import { Portal } from "@/components/portal";

export default function Header({ hideSearch = false }: { hideSearch?: boolean }) {
  const { session } = useAppSession();
  const { itemCount } = useCart();
  const isSignedIn = !!session;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [tenantState, setTenantState] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
      }
    };

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (!isMenuOpen && !isSearchOpen) {
        setIsVisible(!(currentScrollY > lastScrollY && currentScrollY > 100));
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMenuOpen, isSearchOpen]);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen || showLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isSearchOpen, showLogin]);

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
        className={`sticky top-0 z-40 w-full border-b border-neutral-200/60 bg-white/95 backdrop-blur-md transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="mx-auto flex h-20 max-w-7xl items-center gap-8 px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative w-9 h-9 transition-transform group-hover:scale-105">
                <Image src="/vendly.png" alt="Vendly" width={36} height={36} className="object-contain" />
              </div>
              <span className="text-lg font-semibold tracking-tight">vendly</span>
            </Link>

            {/* Search */}
            {!hideSearch && (
              <div className="flex-1 max-w-3xl">
                <Search />
              </div>
            )}

            {/* Actions */}
            <div
              className={`flex shrink-0 items-center justify-end gap-4 ${hideSearch ? "ml-auto" : ""}`}
              style={{ minWidth: 220 }}
            >
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="group relative p-2.5 rounded-full hover:bg-neutral-100 active:scale-95 transition-all"
                aria-label="Wishlist"
              >
                <HugeiconsIcon icon={FavouriteIcon} size={22} className="text-neutral-700 group-hover:text-black transition-colors" />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="group relative p-2.5 rounded-full hover:bg-neutral-100 active:scale-95 transition-all"
                aria-label="Cart"
              >
                <HugeiconsIcon icon={ShoppingBag02Icon} size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white ring-2 ring-white animate-in zoom-in-50 duration-200">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isSignedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 ring-black rounded-full">
                    <div className="group p-0.5 rounded-full hover:bg-neutral-100 active:scale-95 transition-all">
                      <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-neutral-200 transition-colors">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback className="bg-neutral-900 text-white text-sm font-medium">
                          {session?.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 p-2 mt-2 animate-in fade-in-0 zoom-in-95 duration-200 bg-white/95 text-neutral-900 border border-primary/15 shadow-lg"
                  >
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback className="bg-neutral-900 text-white font-medium">
                          {session?.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-0.5">
                        {session?.user?.name && (
                          <p className="font-semibold text-sm leading-none">{session.user.name}</p>
                        )}
                        {session?.user?.email && (
                          <p className="text-xs text-neutral-500 leading-none truncate max-w-[180px]">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="h-px bg-neutral-100 mb-2" />
                    <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2.5 hover:bg-primary/10 focus:bg-primary/10 hover:text-primary focus:text-primary">
                      <Link href="/account/orders" className="w-full flex items-center gap-3">
                        <HugeiconsIcon icon={PackageIcon} size={18} className="text-neutral-500" />
                        <span className="font-medium text-sm">My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2.5 hover:bg-primary/10 focus:bg-primary/10 hover:text-primary focus:text-primary">
                      <Link href="/account/settings" className="w-full flex items-center gap-3">
                        <HugeiconsIcon icon={Settings02Icon} size={18} className="text-neutral-500" />
                        <span className="font-medium text-sm">Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <div className="h-px bg-neutral-100 my-2" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer rounded-md px-3 py-2.5 text-red-200 hover:bg-red-500/20 focus:bg-red-500/20 focus:text-red-200"
                    >
                      <div className="w-full flex items-center gap-3">
                        <HugeiconsIcon icon={Logout03Icon} size={18} />
                        <span className="font-medium text-sm">Sign out</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setShowLogin(true)}
                  className="group flex items-center gap-2 px-5 py-2.5 hover:text-primary h-auto active:scale-95 transition-all"
                  aria-label="Sign in"
                  variant="ghost"
                >
                  Sign in
                </Button>
              )}

              {/* Sell Now Button */}
              {showSellButton && (
                <Button
                  onClick={handleSellNow}
                  className="bg-primary hover:bg-primary/80 text-white font-medium px-5 py-2.5 h-auto rounded-md active:scale-95 transition-all shadow-sm hover:shadow-md"
                >
                  Sell now
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Menu Button */}
            <button
              aria-label="Toggle menu"
              className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 active:bg-neutral-200 active:scale-95 transition-all"
              onClick={() => {
                setIsMenuOpen((v) => !v);
                setIsSearchOpen(false);
              }}
            >
              <HugeiconsIcon icon={isMenuOpen ? Cancel01Icon : MenuIcon} size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              <Image src="/vendly.png" alt="Vendly" width={28} height={28} />
              <span className="text-base font-semibold tracking-tight">vendly</span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <button
                aria-label="Search"
                className="p-2 rounded-lg hover:bg-neutral-100 active:bg-neutral-200 active:scale-95 transition-all"
                onClick={() => {
                  setIsSearchOpen((v) => !v);
                  setIsMenuOpen(false);
                }}
              >
                <HugeiconsIcon icon={Search01Icon} size={22} />
              </button>

              <Link
                href="/cart"
                aria-label="Cart"
                className="relative p-2 rounded-lg hover:bg-neutral-100 active:bg-neutral-200 active:scale-95 transition-all"
              >
                <HugeiconsIcon icon={ShoppingBag02Icon} size={22} />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground ring-2 ring-white">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <Portal>
              <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl animate-in slide-in-from-left duration-300">
                  {/* Menu Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
                    <div className="flex items-center gap-2.5">
                      <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
                      <span className="text-lg font-semibold tracking-tight">vendly</span>
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-neutral-100 active:scale-95 transition-all"
                      aria-label="Close menu"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={24} />
                    </button>
                  </div>

                  {/* Menu Content */}
                  <div className="p-4 space-y-1">
                    {/* User Section */}
                    {isSignedIn && session?.user && (
                      <div className="mb-6 px-3 py-4 rounded-xl bg-neutral-50 border border-neutral-200">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={session.user.image || ""} />
                            <AvatarFallback className="bg-neutral-900 text-white font-medium">
                              {session.user.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            {session?.user?.name && (
                              <p className="font-semibold text-sm leading-tight">{session.user.name}</p>
                            )}
                            {session?.user?.email && (
                              <p className="text-xs text-neutral-500 leading-tight truncate mt-1">
                                {session.user.email}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href="/account/orders"
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-white rounded-lg border border-neutral-200 hover:bg-neutral-50 active:scale-95 transition-all"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <HugeiconsIcon icon={PackageIcon} size={14} />
                            Orders
                          </Link>
                          <Link
                            href="/account/settings"
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-white rounded-lg border border-neutral-200 hover:bg-neutral-50 active:scale-95 transition-all"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <HugeiconsIcon icon={Settings02Icon} size={14} />
                            Settings
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Menu Items */}
                    <MenuItem
                      icon={FavouriteIcon}
                      label="Wishlist"
                      href="/wishlist"
                      onClick={() => setIsMenuOpen(false)}
                      delay={0}
                    />

                    {showSellButton && (
                      <MenuItem
                        icon={ArrowRight01Icon}
                        label="Sell now"
                        onClick={() => {
                          handleSellNow();
                          setIsMenuOpen(false);
                        }}
                        delay={50}
                        highlight
                      />
                    )}

                    {!isSignedIn && (
                      <MenuItem
                        icon={UserCircleIcon}
                        label="Sign in"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setShowLogin(true);
                        }}
                        delay={100}
                      />
                    )}

                    <MenuItem
                      label="Contact us"
                      href="/contact"
                      onClick={() => setIsMenuOpen(false)}
                      delay={150}
                    />

                    {isSignedIn && (
                      <>
                        <div className="h-px bg-neutral-200 my-4" />
                        <MenuItem
                          icon={Logout03Icon}
                          label="Sign out"
                          onClick={() => {
                            handleSignOut();
                            setIsMenuOpen(false);
                          }}
                          danger
                          delay={200}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Portal>
          )}

          {/* Mobile Search Overlay */}
          {isSearchOpen && !hideSearch && (
            <Portal>
              <div className="fixed inset-0 z-50 bg-white animate-in fade-in duration-200">
                <div className="p-4 pt-6">
                  {/* Search Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 active:scale-95 transition-all"
                      aria-label="Close search"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={22} />
                    </button>
                    <h2 className="text-lg font-semibold">Search</h2>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <Input
                      autoFocus
                      type="search"
                      placeholder="Search products, stores, creators…"
                      className="h-14 pl-12 pr-4 rounded-2xl border-2 border-neutral-200 focus:border-black shadow-sm text-base bg-white transition-colors"
                    />
                  </div>

                  {/* Recent/Popular Searches Could Go Here */}
                  <div className="mt-8 text-center">
                    <p className="text-sm text-neutral-500">Start typing to search</p>
                  </div>
                </div>
              </div>
            </Portal>
          )}
        </div>
      </header>

      {/* Login Overlay */}
      {showLogin && (
        <Portal>
          <LoginOverlay onClose={() => setShowLogin(false)} />
        </Portal>
      )}
    </>
  );
}

// Mobile Menu Item Component
function MenuItem({
  icon,
  label,
  href,
  onClick,
  danger = false,
  highlight = false,
  delay = 0,
}: {
  icon?: any;
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
  highlight?: boolean;
  delay?: number;
}) {
  const className = `group flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-medium transition-all active:scale-98 animate-in fade-in slide-in-from-left-2 duration-300 ${danger
    ? "text-red-600 hover:bg-red-50"
    : highlight
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "hover:bg-neutral-50"
  }`;

  const content = (
    <>
      {icon && (
        <HugeiconsIcon
          icon={icon}
          size={20}
          className={danger ? "" : highlight ? "" : "text-neutral-600 group-hover:text-black transition-colors"}
        />
      )}
      <span className="flex-1 text-left">{label}</span>
      {!danger && !highlight && (
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-neutral-400 group-hover:text-black transition-colors" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} onClick={onClick} style={{ animationDelay: `${delay}ms` }}>
        {content}
      </Link>
    );
  }

  return (
    <button className={className} onClick={onClick} style={{ animationDelay: `${delay}ms` }}>
      {content}
    </button>
  );
}