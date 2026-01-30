"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ProductTable, type ProductTableRow, type ProductStatus } from "./components/product-table";
import { ProductStats } from "./components/product-header";
import { AddProductButton } from "./components/add-product-button";
import { UploadModal } from "./components/upload-modal";
import { EditProductModal } from "./components/edit-product-modal";
import { AddProduct } from "./components/add-product";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download04Icon, FilterIcon } from "@hugeicons/core-free-icons";

const API_BASE = "";

interface ProductAPIResponse {
    id: string;
    productName: string;
    priceAmount: number;
    currency: string;
    quantity: number;
    status: string;
    isFeatured: boolean;
    media: Array<{ blobUrl: string }>;
}

export default function ProductsPage() {
    const params = useParams();
    const tenantSlug = params?.tenant as string;

    // In a real app, these would come from auth context
    // For now, we'll pass them via headers
    const [tenantId, setTenantId] = React.useState<string>("");
    const [storeId, setStoreId] = React.useState<string>("");

    const [products, setProducts] = React.useState<ProductTableRow[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // Modal states
    const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
    const [addManualOpen, setAddManualOpen] = React.useState(false);
    const [editModalOpen, setEditModalOpen] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState<ProductTableRow | null>(null);

    // Fetch products
    const fetchProducts = React.useCallback(async () => {
        if (!tenantId) return;

        if (products.length === 0) {
            setIsLoading(true);
        }
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/api/products`, {
                headers: {
                    "x-tenant-id": tenantId,
                    "x-tenant-slug": tenantSlug,
                },
            });

            console.log("API Response Status:", response.status);
            console.log("API Response Headers:", Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const text = await response.text();
                console.error("API Error Response:", text.substring(0, 200));
                throw new Error(`Failed to fetch products: ${response.status}`);
            }

            const data = await response.json();
            console.log("API Response Data:", data);
            const productList: ProductAPIResponse[] = data.data?.products || [];

            // Transform API response to table format
            const transformed: ProductTableRow[] = productList.map((p) => ({
                id: p.id,
                productName: p.productName,
                priceAmount: p.priceAmount,
                currency: p.currency,
                quantity: p.quantity,
                status: p.status as ProductStatus,
                thumbnailUrl: p.media?.[0]?.blobUrl,
                hasContentVariants: false,
                salesAmount: 0, // Not tracked yet
            }));

            setProducts(transformed);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load products");
        } finally {
            setIsLoading(false);
        }
    }, [tenantId, tenantSlug]);

    // Initial fetch - get tenant info from URL or mock for now
    React.useEffect(() => {
        // In production, this would come from auth context
        // For development, we'll use stored values or mock
        const storedTenantId = localStorage.getItem("vendly_tenant_id");
        const storedStoreId = localStorage.getItem("vendly_store_id");

        if (storedTenantId) {
            setTenantId(storedTenantId);
        }
        if (storedStoreId) {
            setStoreId(storedStoreId);
        }
    }, []);

    React.useEffect(() => {
        if (tenantId) {
            fetchProducts();
        }
    }, [tenantId, fetchProducts]);

    const handleEdit = (id: string) => {
        const product = products.find((p) => p.id === id);
        if (product) {
            setEditingProduct(product);
            setEditModalOpen(true);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`${API_BASE}/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "x-tenant-id": tenantId,
                    "x-tenant-slug": tenantSlug,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            fetchProducts();
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleGenerateVariants = (id: string) => {
        console.log("Generate variants for:", id);
        // TODO: Implement AI variant generation
    };

    const activeCount = products.filter(
        (p) => p.status === "active" || p.status === "ready"
    ).length;
    const draftCount = products.filter((p) => p.status === "draft").length;
    const lowStockCount = products.filter((p) => p.quantity < 5).length;

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
                    <p className="text-sm text-muted-foreground">
                        Keep your catalog tidy and stay on top of stock.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <AddProductButton
                        onUploadClick={() => setUploadModalOpen(true)}
                        onInstagramClick={() => {
                            // TODO: Instagram import
                        }}
                    />
                </div>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                    {error}
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-4"
                        onClick={fetchProducts}
                    >
                        Retry
                    </Button>
                </div>
            )}

            <ProductStats
                totalProducts={products.length}
                activeNow={activeCount}
                newProducts={draftCount}
                lowStock={lowStockCount}
                isLoading={isLoading}
            />

            <div className="rounded-md border bg-card p-2 sm:p-4">
                <ProductTable
                    products={products}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onGenerateVariants={handleGenerateVariants}
                    isLoading={isLoading}
                />
            </div>

            {/* Upload Modal */}
            <UploadModal
                open={uploadModalOpen}
                onOpenChange={setUploadModalOpen}
                storeId={storeId}
                tenantId={tenantId}
                tenantSlug={tenantSlug}
                onUploadComplete={fetchProducts}
            />

            {/* Manual Add Modal */}
            {addManualOpen && (
                <AddProduct
                    storeId={storeId}
                    onProductCreated={() => {
                        setAddManualOpen(false);
                        fetchProducts();
                    }}
                />
            )}

            {/* Edit Modal */}
            <EditProductModal
                product={editingProduct}
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                tenantId={tenantId}
                onProductUpdated={fetchProducts}
            />
        </div>
    );
}