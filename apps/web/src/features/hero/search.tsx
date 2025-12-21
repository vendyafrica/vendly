"use client";

import SearchBar from "./search-bar";
import FavoriteShops from "@/features/favorite-shops/favorite-shops";

export default function HeroSearch() {

  return (
    <>
    <div
      className={`fixed top-[40vh] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-6 z-10`}
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-medium mb-4">What would you like ?</h1>
        <p className="text-muted-foreground text-lg">Discover your favorite stores</p>
      </div>
      <SearchBar />
    </div>
    <FavoriteShops />
    </>
  );
}
