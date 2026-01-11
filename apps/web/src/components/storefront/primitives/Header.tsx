"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon,ShoppingBasket01Icon,FavouriteIcon} from "@hugeicons/core-free-icons";

interface HeaderProps {
  storeSlug?: string;
  storeName?: string;
  overlay?: boolean;
}

export function Header({ storeSlug, storeName, overlay }: HeaderProps) {
  const { toggleCart, totalItems } = useCart();

  // Use CSS variables injected by StorefrontHome
  const bgColor = overlay ? "transparent" : "var(--background, #ffffff)";
  // If overlay, force white/light text, else use theme foreground
  const textColor = overlay ? "rgba(255,255,255,0.95)" : "var(--foreground, #111111)";

  const navItems = [
    { label: "Men", href: `/${storeSlug}/products?collection=men` },
    { label: "Women", href: `/${storeSlug}/products?collection=women` },
    { label: "All Products", href: `/${storeSlug}/products` },
  ];

  return (
    <header
      className={overlay ? "absolute top-0 left-0 right-0 z-50 transition-colors duration-300" : "sticky top-0 z-50 border-b border-[var(--border,transparent)] transition-colors duration-300"}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: "var(--font-body, inherit)",
        backdropFilter: overlay ? undefined : "saturate(180%) blur(5px)",
      }}
    >
      <div className="mx-auto px-4 lg:px-8 max-w-[var(--container-max,1400px)]">
        <div className="flex h-16 items-center justify-between">
          {/* Left Navigation */}
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hidden md:flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-70"
                style={{
                  color: textColor,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Center Logo */}
          <Link
            href={`/${storeSlug}`}
            className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold tracking-tight"
            style={{
              color: textColor,
              fontFamily: "var(--font-heading, inherit)",
              textShadow: overlay ? "0 2px 10px rgba(0,0,0,0.3)" : undefined,
            }}
          >
            {storeName || "Store"}
          </Link>

          {/* Right Actions */}
          <div className="flex items-center space-x-5 ml-auto">
            {/* Wishlist */}
            <button
              className="transition-colors hover:opacity-70"
              style={{ color: textColor }}
            >
             <HugeiconsIcon icon={FavouriteIcon} /> 
            </button>

            {/* User */}
            <button
              className="transition-colors hover:opacity-70"
              style={{ color: textColor }}
            >
             <HugeiconsIcon icon={UserIcon} /> 
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative transition-colors hover:opacity-70"
              style={{ color: textColor }}
            >
             <HugeiconsIcon icon={ShoppingBasket01Icon} /> 
              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 h-5 w-5 text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "var(--primary, #111)",
                    color: "var(--primary-foreground, #fff)",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
