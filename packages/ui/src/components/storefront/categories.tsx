import * as React from "react";
import { cn } from "../../lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  image: string;
  href: string;
}

interface CategoriesProps {
  title: string;
  subtitle?: string;
  layout: "grid" | "list";
  columns: number;
  showImages: boolean;
  cardStyle: "minimal" | "elevated" | "bordered";
  textAlign: "left" | "center" | "right";
  backgroundColor?: string;
  padding?: string;
  storeSlug?: string;
}

const defaultCategories: Category[] = [
  { id: "1", name: "Men's Collection", image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=500&q=80", href: "/products?collection=men" },
  { id: "2", name: "Women's Collection", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80", href: "/products?collection=women" },
  { id: "3", name: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80", href: "/products?collection=accessories" },
  { id: "4", name: "New Arrivals", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=80", href: "/products?collection=new" },
];

export function Categories({
  title,
  subtitle,
  layout,
  columns,
  showImages,
  cardStyle,
  textAlign,
  backgroundColor,
  padding,
  storeSlug = ""
}: CategoriesProps) {
  const cardClasses = {
    minimal: "hover:opacity-80 transition-opacity",
    elevated: "shadow-lg hover:shadow-xl transition-shadow bg-white rounded-lg overflow-hidden",
    bordered: "border border-gray-200 hover:border-gray-300 transition-colors bg-white rounded-lg overflow-hidden"
  }[cardStyle];

  const gridColumns = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }[columns] || "grid-cols-1 md:grid-cols-3";

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

        {/* Categories Grid/List */}
        <div className={cn(
          layout === "grid" ? `grid gap-6 ${gridColumns}` : "space-y-4"
        )}>
          {defaultCategories.slice(0, columns).map((category) => (
            <Link
              key={category.id}
              href={`/${storeSlug}${category.href}`}
              className={cn("group block", cardClasses)}
            >
              {showImages && (
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {cardStyle === "minimal" && (
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  )}
                </div>
              )}
              <div className={cn(
                "p-6",
                !showImages && "py-8",
                cardStyle === "minimal" && showImages && "absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent"
              )}>
                <h3 className={cn(
                  "text-xl font-semibold transition-colors",
                  cardStyle === "minimal" && showImages ? "text-white" : "text-gray-900 group-hover:text-gray-600"
                )}>
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
