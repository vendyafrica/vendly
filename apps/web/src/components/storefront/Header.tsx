"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { Search, ShoppingCart, Menu, X } from "lucide-react";

interface HeaderProps {
  storeSlug?: string;
  storeName?: string;
}

export function Header({ storeSlug, storeName }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleCart, totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${storeSlug}`} className="text-2xl font-bold text-foreground">
            {storeName || "Store"}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href={`/${storeSlug}`} className="text-sm font-medium text-foreground hover:text-muted-foreground">
              Home
            </Link>
            <Link href={`/${storeSlug}/products`} className="text-sm font-medium text-foreground hover:text-muted-foreground">
              Products
            </Link>
            <Link href={`/${storeSlug}/categories`} className="text-sm font-medium text-foreground hover:text-muted-foreground">
              Categories
            </Link>
            <Link href={`/${storeSlug}/about`} className="text-sm font-medium text-foreground hover:text-muted-foreground">
              About
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Cart */}
            <button 
              onClick={toggleCart}
              className="relative p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link href={`/${storeSlug}`} className="text-sm font-medium text-foreground hover:text-muted-foreground">
                Home
              </Link>
              <Link href={`/${storeSlug}/products`} className="text-sm font-medium text-foreground hover:text-muted-foreground">
                Products
              </Link>
              <Link href={`/${storeSlug}/categories`} className="text-sm font-medium text-foreground hover:text-muted-foreground">
                Categories
              </Link>
              <Link href={`/${storeSlug}/about`} className="text-sm font-medium text-foreground hover:text-muted-foreground">
                About
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
