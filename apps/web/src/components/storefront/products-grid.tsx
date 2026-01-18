"use client";

import type { Product } from "@/types/storefront";
import { ProductCard } from "./product-card";

interface AllProductsGridProps {
    products: Product[];
}

export function AllProductsGrid({ products }: AllProductsGridProps) {
    if (products.length === 0) {
        return (
            <section id="products" className="py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-xl md:text-2xl font-medium tracking-tight mb-4">
                        All Products
                    </h2>
                    <p className="text-neutral-500 text-sm">
                        No products available yet. Check back soon!
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="products" className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section header */}
                <h2 className="text-xl md:text-2xl font-medium tracking-tight mb-10">
                    All Products
                </h2>

                {/* Product grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
