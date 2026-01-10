"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { Search, ShoppingCart, Menu, X, User, ChevronDown, Heart } from "lucide-react";

interface ThemeProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  headingFont?: string;
  bodyFont?: string;
}

interface HeaderProps {
  storeSlug?: string;
  storeName?: string;
  theme?: ThemeProps;
}

export function Header({ storeSlug, storeName, theme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleCart, totalItems } = useCart();

  // Use theme colors or fallback to defaults
  const bgColor = theme?.primaryColor || "#1a1a2e";
  const textColor = theme?.accentColor || "#ffffff";

  const navItems = [
    { label: "Home", href: `/${storeSlug}`, hasDropdown: false },
    { label: "Pages", href: `/${storeSlug}/pages`, hasDropdown: true },
    { label: "Blog", href: `/${storeSlug}/blog`, hasDropdown: true },
    { label: "Shop", href: `/${storeSlug}/products`, hasDropdown: true },
  ];

  return (
    <header 
      className="sticky top-0 z-50"
      style={{ 
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: theme?.bodyFont || 'inherit'
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1 text-sm font-medium transition-colors"
                style={{ 
                  color: `${textColor}e6`,
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = textColor}
                onMouseLeave={(e) => e.currentTarget.style.color = `${textColor}e6`}
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>
            ))}
          </nav>

          {/* Center Logo */}
          <Link 
            href={`/${storeSlug}`} 
            className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-serif italic tracking-wide"
            style={{ 
              color: textColor,
              fontFamily: theme?.headingFont || 'inherit'
            }}
          >
            {storeName || "Store"}
          </Link>

          {/* Right Actions */}
          <div className="flex items-center space-x-5 ml-auto">
            {/* Search */}
            <button 
              className="transition-colors"
              style={{ color: `${textColor}e6` }}
              onMouseEnter={(e) => e.currentTarget.style.color = textColor}
              onMouseLeave={(e) => e.currentTarget.style.color = `${textColor}e6`}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <button 
              className="hidden sm:block transition-colors"
              style={{ color: `${textColor}e6` }}
              onMouseEnter={(e) => e.currentTarget.style.color = textColor}
              onMouseLeave={(e) => e.currentTarget.style.color = `${textColor}e6`}
            >
              <Heart className="h-5 w-5" />
            </button>

            {/* User */}
            <button 
              className="hidden sm:block transition-colors"
              style={{ color: `${textColor}e6` }}
              onMouseEnter={(e) => e.currentTarget.style.color = textColor}
              onMouseLeave={(e) => e.currentTarget.style.color = `${textColor}e6`}
            >
              <User className="h-5 w-5" />
            </button>

            {/* Cart */}
            <button 
              onClick={toggleCart}
              className="relative transition-colors"
              style={{ color: `${textColor}e6` }}
              onMouseEnter={(e) => e.currentTarget.style.color = textColor}
              onMouseLeave={(e) => e.currentTarget.style.color = `${textColor}e6`}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span 
                  className="absolute -top-2 -right-2 h-5 w-5 text-xs font-semibold rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: textColor,
                    color: bgColor
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden transition-colors"
              style={{ color: `${textColor}e6` }}
              onMouseEnter={(e) => e.currentTarget.style.color = textColor}
              onMouseLeave={(e) => e.currentTarget.style.color = `${textColor}e6`}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav 
            className="lg:hidden py-4"
            style={{ borderTop: `1px solid ${textColor}1a` }}
          >
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between text-sm font-medium py-2"
                  style={{ color: `${textColor}e6` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="h-4 w-4" />}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
