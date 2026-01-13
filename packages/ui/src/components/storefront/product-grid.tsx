import * as React from "react";
import { cn } from "../../lib/utils";
import { ProductCard } from "./product-card";
import { Button } from "../button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PackageIcon, PlusSignIcon } from "@hugeicons/core-free-icons";

interface Product {
    id: string;
    title: string;
    price: number;
    currency: string;
    imageUrl?: string;
}

interface ProductGridProps {
    title?: string;
    products?: Product[];
    columns?: number;
    storeSlug: string;
    onImportClick?: () => void; // Callback for empty state action
}

export function ProductGrid({ title, products = [], columns = 3, storeSlug, onImportClick }: ProductGridProps) {
    // Empty State
    if (products.length === 0) {
        return (
            <div className="py-16 px-4 flex flex-col items-center justify-center text-center bg-gray-50 border-y border-gray-100">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <HugeiconsIcon icon={PackageIcon} className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Products</h3>
                <p className="text-gray-500 max-w-md mb-6">
                    Your store needs products to shine. Import them easily or add them manually.
                </p>
                {onImportClick && (
                    <Button onClick={onImportClick} className="gap-2">
                        <HugeiconsIcon icon={PlusSignIcon} />
                        Import Products
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="py-12 px-4 md:px-8 max-w-[var(--container-max,1400px)] mx-auto">
            {title && <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[var(--foreground,#111)] font-heading">{title}</h2>}
            <div className={cn(
                "grid gap-x-6 gap-y-10",
                "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                columns === 4 && "xl:grid-cols-4",
            )}>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        currency={product.currency}
                        imageUrl={product.imageUrl}
                        storeSlug={storeSlug}
                    />
                ))}
            </div>
        </div>
    );
}
