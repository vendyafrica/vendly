"use client";

import "@/styles/home.css";
import { usefavoriteShops } from "./hooks/useFavoriteShops";

export default function FavoriteShops() {
  const shops = usefavoriteShops();

  return (
    <section className="mt-12 w-full">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 px-6">Favorite Shops</h2>
        <div className="carousel-container relative overflow-x-auto overflow-y-visible">
          <div className="carousel-track flex gap-6 pb-6 px-6 md:px-6" style={{ width: "max-content" }}>
            {shops.map((shop, index) => (
              <div
                key={index}
                className="flex flex-col items-center min-w-[140px] cursor-pointer group shrink-0"
              >
                <div className="w-36 h-36 rounded-full overflow-hidden mb-3 group-hover:scale-105 transition-transform shadow-lg">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors">
                  {shop.name}
                </span>
              </div>
            ))}
            {shops.map((shop, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex flex-col items-center min-w-[140px] cursor-pointer group shrink-0"
              >
                <div className="w-36 h-36 rounded-full overflow-hidden mb-3 group-hover:scale-105 transition-transform shadow-lg">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors">
                  {shop.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}