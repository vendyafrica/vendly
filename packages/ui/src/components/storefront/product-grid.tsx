import * as React from "react";
import { cn } from "../../lib/utils";
import Image from "next/image";

interface ProductGridProps {
    title: string;
    columns?: number;
}

export function ProductGrid({ title, columns = 3 }: ProductGridProps) {
    return (
        <div className="py-12 px-8">
            <h2 className="text-2xl font-bold mb-8 text-center">{title}</h2>
            <div className={cn(
                "grid gap-6",
                columns === 2 && "grid-cols-1 md:grid-cols-2",
                columns === 3 && "grid-cols-1 md:grid-cols-3",
                columns === 4 && "grid-cols-1 md:grid-cols-4",
            )}>
                {[1, 2, 3, 4, 5, 6].slice(0, columns * 2).map((i) => (
                    <div key={i} className="border rounded-lg overflow-hidden shadow-sm bg-white relative group">
                        <div className="aspect-square bg-gray-200 w-full relative">
                            {/* Placeholder for real product image */}
                            <Image
                                src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80`}
                                alt="Product"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
