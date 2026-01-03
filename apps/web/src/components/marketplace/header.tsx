"use client";

import Image from "next/image";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuTrigger,
// } from "@vendly/ui/components/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  ShoppingCart01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
// import { useState } from "react";
import { signInWithGoogle, SignOut } from "@/lib/auth";

const handleGoogleSignIn = async () => {
  try {
    await signInWithGoogle();
  } catch (error) {
    console.error("Google sign-in failed", error);
  }
};

const handleSignOut = async () =>{
  try {
    await SignOut();
  } catch (error) {
    console.error("Sign-out failed", error);
  }
}

// const categories = [
//   "Women",
//   "Men",
//   "Beauty",
//   "Food & drinks",
//   "Baby & toddler",
//   "Home",
//   "Fitness & nutrition",
//   "Accessories",
// ];

export default function Header() {
  // const [selectedCategory, setSelectedCategory] = useState("Women");
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
          <span className="text-base font-semibold tracking-tight">vendly</span>
        </div>

        {/* Search */}
        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-2xl">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <HugeiconsIcon icon={Search01Icon} size={15} />
            </div>
            <Input
              type="search"
              placeholder="Search products, stores, creators…"
              className="h-10 pl-9 pr-4 text-md transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Categories"
                className="cursor-pointer"
                suppressHydrationWarning
              >
                <HugeiconsIcon icon={Menu01Icon} size={28} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                {categories.map((category) => (
                  <DropdownMenuRadioItem key={category} value={category}>
                    {category}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu> */}

          <Button variant="ghost" size="icon-lg" className="cursor-pointer">
            <HugeiconsIcon icon={FavouriteIcon} size={28} />
          </Button>

          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="Cart"
            className="cursor-pointer"
          >
            <HugeiconsIcon icon={ShoppingCart01Icon} size={28} />
          </Button>

          <Button
            size="lg"
            className="ml-2 px-5 text-sm font-semibold cursor-pointer"
            onClick={handleGoogleSignIn}
          >
            Sign in
          </Button>
          <Button onClick={handleSignOut}>
            sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
