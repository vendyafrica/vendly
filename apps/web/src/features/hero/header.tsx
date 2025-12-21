import SearchBar from "@/features/hero/search-bar";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  ShoppingBasket01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  showSearch?: boolean;
}

export default function Header({ showSearch = true }: HeaderProps) {

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* Logo Section */}
      <Link
        href="/"
        className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <Image src="/icon.png" alt="vendly logo" width={32} height={32} />
        <span className="font-medium text-foreground">vendly.</span>
      </Link>

      {/* Search bar - only show on desktop when showSearch is true, never on mobile */}
      {showSearch && (
        <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-xl hidden md:block">
          <SearchBar />
        </div>
      )}

      {/* User Profile Section */}
      <div className="flex items-center gap-4 shrink-0  cursor-pointer">
        <HugeiconsIcon icon={FavouriteIcon} className="w-5 h-5" />
        <HugeiconsIcon icon={ShoppingBasket01Icon} className="w-5 h-5" />
        <Button className=" cursor-pointer">Sell</Button>
        <Button className=" cursor-pointer">Login</Button>
      </div>
    </header>
  );
}
