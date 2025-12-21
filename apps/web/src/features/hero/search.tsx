"use client";

import SearchBar from "./search-bar";
import FavoriteShops from "@/features/favorite-shops/favorite-shops";

export default function HeroSearch() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-2xl px-6 z-10 flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium mb-4">
            What would you like?
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Discover your favorite stores
          </p>
        </div>
        <SearchBar />
      </div>
      <FavoriteShops />
    </div>
  );
}
