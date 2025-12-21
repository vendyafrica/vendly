"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Search from "@/components/search";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 100;
          setScrolled(isScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shops = [
    { name: "Women's Clothing", image: "https://picsum.photos/300/300?women" },
    { name: "Men's Clothing", image: "https://picsum.photos/300/300?men" },
    { name: "Kids & Baby", image: "https://picsum.photos/300/300?kids" },
    { name: "Cozy Knits", image: "https://picsum.photos/300/300?knits" },
    { name: "Personalized Tees", image: "https://picsum.photos/300/300?tees" },
    { name: "Jackets & Coats", image: "https://picsum.photos/300/300?jackets" },
    { name: "Summer Collection", image: "https://picsum.photos/300/300?summer" },
    { name: "Winter Essentials", image: "https://picsum.photos/300/300?winter" },
    { name: "Accessories", image: "https://picsum.photos/300/300?accessories" },
    { name: "Footwear", image: "https://picsum.photos/300/300?shoes" },
  ];

  return (
    <>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .carousel-track {
          animation: scroll 30s linear infinite;
        }
        
        .carousel-track:hover {
          animation-play-state: paused;
        }
        
        .carousel-container::-webkit-scrollbar {
          display: none;
        }
        
        .carousel-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="min-h-screen bg-background">
        {/* Header - search will appear here when scrolled */}
        <Header showSearch={scrolled} />
        
        {/* Main content */}
        <main className="relative">
          {/* Centered search bar - fades out when scrolled */}
          <div className={`fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-6 z-10 transition-all duration-300 ease-out ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-medium mb-4">Welcome to Vendly</h1>
              <p className="text-muted-foreground text-lg">
                Discover products from your favourite stores
              </p>
            </div>
            <Search />
          </div>
          
          {/* Favourites Section */}
          <section className="mt-[45vh] w-full overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 px-6">Favourite Shops</h2>
            <div className="carousel-container relative overflow-hidden">
              <div className="carousel-track flex gap-6 pb-6 px-6">
                {/* Original items */}
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
                {/* Duplicate items for seamless loop */}
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
          </section>
          
          <section className="py-16 px-6 bg-muted/50">
            <h2 className="text-2xl font-semibold mb-8">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Electronics", "Fashion", "Home", "Sports"].map((cat) => (
                <div key={cat} className="bg-card rounded-lg p-8 text-center border">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
                  <p className="font-medium">{cat}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}