"use client";

import { ProductTable, type ProductTableRow } from "./components/product-table";
import { AddProduct } from "./components/add-product";
import { ProductStats } from "./components/product-header";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download04Icon, FilterIcon } from "@hugeicons/core-free-icons";

// Mock data - will be replaced with API calls
const mockProducts: ProductTableRow[] = [
    {
        id: "1",
        title: "Classic White Shirt",
        priceAmount: 250000, // 2500 KES in cents
        currency: "KES",
        quantity: 15,
        status: "published",
        thumbnailUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=100&h=100&fit=crop",
        hasContentVariants: true,
    },
    {
        id: "2",
        title: "Vintage Denim Jacket",
        priceAmount: 450000,
        currency: "KES",
        quantity: 8,
        status: "ready",
        thumbnailUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop",
        hasContentVariants: false,
    },
    {
        id: "3",
        title: "Summer Floral Dress",
        priceAmount: 350000,
        currency: "KES",
        quantity: 0,
        status: "draft",
        hasContentVariants: false,
    },
];

export default function ProductsPage() {
    const handleEdit = (id: string) => {
        console.log("Edit product:", id);
    };

    const handleDelete = (id: string) => {
        console.log("Delete product:", id);
    };

    const handleGenerateVariants = (id: string) => {
        console.log("Generate variants for:", id);
    };

    const handleProductCreated = () => {
        console.log("Product created, refresh list");
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your product catalog and view their performance.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <HugeiconsIcon icon={Download04Icon} className="h-4 w-4" />
                        Export
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <HugeiconsIcon icon={FilterIcon} className="h-4 w-4" />
                        Filter
                    </Button>
                    <AddProduct onProductCreated={handleProductCreated} />
                </div>
            </div>

            <ProductStats
                totalProducts={mockProducts.length}
                activeNow={mockProducts.filter((p) => p.status === "published" || p.status === "ready").length}
                newProducts={mockProducts.filter((p) => p.status === "draft").length}
                lowStock={3}
            />

            <div className="rounded-md border bg-card p-2 sm:p-4">
                <ProductTable
                    products={mockProducts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onGenerateVariants={handleGenerateVariants}
                />
            </div>
        </div>
    );
}