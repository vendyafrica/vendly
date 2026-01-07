"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: string;
  compareAtPrice?: string | null;
  imageUrl?: string;
  slug: string;
}

export interface ProductGridBlockProps {
  title: string;
  showTitle: boolean;
  columns: number;
  maxProducts: number;
  storeSlug?: string;
}

export function ProductGridBlock({
  title,
  showTitle,
  columns = 4,
  maxProducts = 8,
  storeSlug = "",
}: ProductGridBlockProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      if (!storeSlug) {
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(
          `${apiUrl}/api/storefront/${storeSlug}/products?limit=${maxProducts}`
        );
        if (res.ok) {
          const data = await res.json();
          setProducts(
            data.data?.map((p: any) => ({
              id: p.id,
              name: p.title, // API uses 'title' not 'name'
              price: (p.priceAmount / 100).toFixed(2), // Convert cents to dollars
              compareAtPrice: p.compareAtPrice ? (p.compareAtPrice / 100).toFixed(2) : null,
              imageUrl: p.images?.[0]?.url,
              slug: p.id, // Use ID as slug for now
            })) || []
          );
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [storeSlug, maxProducts]);

  // For editor preview, show placeholder cards
  const displayProducts = products.length > 0 
    ? products 
    : Array.from({ length: maxProducts }, (_, i) => ({
        id: `placeholder-${i}`,
        name: `Product ${i + 1}`,
        price: "99.00",
        imageUrl: undefined,
        slug: `product-${i}`,
      }));

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  }[columns] || "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {showTitle && (
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 font-serif">
            {title}
          </h2>
        )}

        {loading ? (
          <div className={`grid ${gridCols} gap-4 md:gap-6`}>
            {Array.from({ length: maxProducts }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-3" />
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
                <div className="bg-gray-200 h-4 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid ${gridCols} gap-4 md:gap-6`}>
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                storeSlug={storeSlug}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: Product;
  storeSlug: string;
}

function ProductCard({ product, storeSlug }: ProductCardProps) {
  const hasImage = !!product.imageUrl;
  const productUrl = storeSlug 
    ? `/${storeSlug}/products/${product.slug}` 
    : `/products/${product.slug}`;

  return (
    <Link href={productUrl} className="group block">
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square mb-3">
        {hasImage ? (
          <Image
            src={product.imageUrl!}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <span className="text-sm">No Image</span>
          </div>
        )}

        {/* Quick Add Button */}
        <button
          className="absolute bottom-3 left-3 right-3 py-2 bg-black/80 text-white text-sm font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Add to cart functionality
            console.log("Add to cart:", product.id);
          }}
        >
          Quick Add
        </button>
      </div>

      <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:underline">
        {product.name}
      </h3>

      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-900">
          ${product.price}
        </span>
        {product.compareAtPrice && (
          <span className="text-sm text-gray-500 line-through">
            ${product.compareAtPrice}
          </span>
        )}
      </div>
    </Link>
  );
}

export default ProductGridBlock;
