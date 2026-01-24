"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@Vendly/ui/components/button";

const categories = [
    {
        id: 1,
        title: "Trending Now",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
        subtitle: "Trending Now",
    },
    {
        id: 2,
        title: "Under $100",
        image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2080&auto=format&fit=crop",
        subtitle: "Under $100",
    },
    {
        id: 3,
        title: "For Her",
        image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop",
        subtitle: "For Her",
    },
    {
        id: 4,
        title: "New Arrivals",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        subtitle: "New Arrivals",
    },
    {
        id: 5,
        title: "Best Sellers",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
        subtitle: "Best Sellers",
    },
];

export default function CategoryCards() {
    return (
    <section className="container mx-auto px-4 py-8">
  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
    {categories.map((category, index) => (
      <div
        key={category.id}
        className={`
          relative h-[160px] md:h-[180px] overflow-hidden rounded-md group cursor-pointer
          /* Mobile Logic: cards 1-4 take 1 col, card 5 spans 2 and centers its content */
          ${index === 4 ? "col-span-2 w-1/2 justify-self-center md:w-full" : "col-span-1"}
          
          /* Desktop Logic: All cards span 2 of the 6 columns (3 per row) */
          md:col-span-2
          
          /* Desktop Centering: The 4th card (index 3) starts at col 2 to center the bottom two */
          ${index === 3 ? "md:col-start-2" : ""}
        `}
      >
        {/* Background Image */}
        <Image
          src={category.image}
          alt={category.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end p-4 md:p-6">
          <h3 className="text-xl md:text-2xl text-white font-serif italic">
            <span className="sr-only">{category.title}</span>
            {category.id === 1 && <>Trending <span className="italic font-serif">Now</span></>}
            {category.id === 2 && <>Under <span className="italic font-serif">$100</span></>}
            {category.id === 3 && <>For <span className="italic font-serif">Her</span></>}
            {category.id === 4 && <>New <span className="italic font-serif">Arrivals</span></>}
            {category.id === 5 && <>Best <span className="italic font-serif">Sellers</span></>}
          </h3>
        </div>
      </div>
    ))}
  </div>
</section>
    );
}
