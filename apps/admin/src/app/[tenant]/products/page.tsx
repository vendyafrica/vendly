"use client";

import { ProductTable, type ProductTableRow } from "./components/product-table";
import { AddProduct } from "./components/add-product";

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Products</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage your product catalog and content variants
                    </p>
                </div>
                <AddProduct onProductCreated={handleProductCreated} />
            </div>

            <ProductTable
                products={mockProducts}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onGenerateVariants={handleGenerateVariants}
            />
        </div>
    );
}