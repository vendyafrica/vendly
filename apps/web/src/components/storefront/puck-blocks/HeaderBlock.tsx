"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { useState } from "react";

export interface HeaderBlockProps {
  storeName: string;
  backgroundColor: string;
  textColor: string;
  showSignIn?: boolean;
  showCart?: boolean;
  storeSlug?: string;
}

export function HeaderBlock({
  storeName,
  backgroundColor,
  textColor,
  showSignIn = true,
  showCart = true,
  storeSlug = "",
}: HeaderBlockProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // TODO: Get cart count from cart context
  const cartCount = 0;

  return (
    <header
      style={{
        backgroundColor,
        color: textColor,
      }}
      className="sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left - Home Link */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={storeSlug ? `/${storeSlug}` : "/"}
              className="text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: textColor }}
            >
              Home
            </Link>
            <Link
              href={storeSlug ? `/${storeSlug}/products` : "/products"}
              className="text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: textColor }}
            >
              Shop
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: textColor }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Center - Logo */}
          <Link
            href={storeSlug ? `/${storeSlug}` : "/"}
            className="absolute left-1/2 -translate-x-1/2 text-2xl font-serif italic tracking-wide"
            style={{ color: textColor }}
          >
            {storeName}
          </Link>

          {/* Right - Actions */}
          <div className="flex items-center gap-4">
            <button
              className="hidden sm:block transition-opacity hover:opacity-80"
              style={{ color: textColor }}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {showSignIn && (
              <Link
                href="/signin"
                className="hidden sm:flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: textColor }}
              >
                <User size={20} />
                <span className="hidden lg:inline">Sign In</span>
              </Link>
            )}

            {showCart && (
              <button
                className="relative transition-opacity hover:opacity-80"
                style={{ color: textColor }}
                aria-label="Cart"
              // TODO: Open cart drawer
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-xs font-semibold flex items-center justify-center"
                    style={{
                      backgroundColor: textColor,
                      color: backgroundColor,
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden py-4 border-t"
            style={{ borderColor: `${textColor}20` }}
          >
            <div className="flex flex-col gap-3">
              <Link
                href={storeSlug ? `/${storeSlug}` : "/"}
                className="text-sm font-medium py-2"
                style={{ color: textColor }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href={storeSlug ? `/${storeSlug}/products` : "/products"}
                className="text-sm font-medium py-2"
                style={{ color: textColor }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default HeaderBlock;
