import * as React from "react";
import { cn } from "../../lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

interface OffersProps {
  title: string;
  subtitle?: string;
  layout: "single" | "double" | "triple";
  showDiscount: boolean;
  ctaStyle: "button" | "link" | "none";
  textAlign: "left" | "center" | "right";
  backgroundColor?: string;
  padding?: string;
  storeSlug?: string;
}

const defaultOffers: Offer[] = [
  {
    id: "1",
    title: "Summer Sale",
    description: "Get up to 50% off on selected items",
    discount: "50% OFF",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    ctaText: "Shop Now",
    ctaLink: "/products?sale=true"
  },
  {
    id: "2", 
    title: "New Collection",
    description: "Discover our latest arrivals",
    discount: "NEW",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    ctaText: "Explore",
    ctaLink: "/products?collection=new"
  },
  {
    id: "3",
    title: "Free Shipping",
    description: "On orders over $100",
    discount: "FREE",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80",
    ctaText: "Learn More",
    ctaLink: "/shipping"
  }
];

export function Offers({
  title,
  subtitle,
  layout,
  showDiscount,
  ctaStyle,
  textAlign,
  backgroundColor,
  padding,
  storeSlug = ""
}: OffersProps) {
  const layoutClasses = {
    single: "grid-cols-1",
    double: "grid-cols-1 md:grid-cols-2", 
    triple: "grid-cols-1 md:grid-cols-3"
  }[layout];

  const offersToShow = defaultOffers.slice(0, layout === "single" ? 1 : layout === "double" ? 2 : 3);

  return (
    <section 
      className={cn("w-full", padding || "py-16")}
      style={{ backgroundColor: backgroundColor || "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className={cn("mb-12", `text-${textAlign}`)}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-heading, inherit)" }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Offers Grid */}
        <div className={cn("grid gap-8", layoutClasses)}>
          {offersToShow.map((offer) => (
            <div key={offer.id} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              {/* Background Image */}
              <div className="aspect-[16/10] relative">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
                
                {/* Discount Badge */}
                {showDiscount && (
                  <div className="absolute top-6 left-6">
                    <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-bold">
                      {offer.discount}
                    </span>
                  </div>
                )}

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-white/90 mb-6 text-lg">
                    {offer.description}
                  </p>
                  
                  {/* CTA */}
                  {ctaStyle !== "none" && (
                    <div>
                      {ctaStyle === "button" ? (
                        <Link
                          href={`/${storeSlug}${offer.ctaLink}`}
                          className="inline-flex items-center bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                          {offer.ctaText}
                        </Link>
                      ) : (
                        <Link
                          href={`/${storeSlug}${offer.ctaLink}`}
                          className="inline-flex items-center text-white font-semibold hover:underline"
                        >
                          {offer.ctaText} →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
