"use client";

import * as React from "react";
import { useTenant } from "../tenant-context";
import { ProductTable, type ProductTableRow, type ProductStatus } from "./components/product-table";
import { ProductStats } from "./components/product-header";
import { AddProductButton } from "./components/add-product-button";
import { UploadModal } from "./components/upload-modal";
import { EditProductModal } from "./components/edit-product-modal";
import { AddProduct } from "./components/add-product";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download04Icon, FilterIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

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

interface ProductsListResponse {
    products: ProductAPIResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function ProductsPage() {
    const { bootstrap, isLoading: isBootstrapping, error: bootstrapError } = useTenant();

    const [products, setProducts] = React.useState<ProductTableRow[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // Selection
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [isBulkPublishing, setIsBulkPublishing] = React.useState(false);

    // Modal states
    const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
    const [addManualOpen, setAddManualOpen] = React.useState(false);
    const [editModalOpen, setEditModalOpen] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState<ProductTableRow | null>(null);

    // Fetch products
    const fetchProducts = React.useCallback(async () => {
        if (!bootstrap) return;

        if (products.length === 0) {
            setIsLoading(true);
        }
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/api/products?storeId=${bootstrap.storeId}`);

            console.log("API Response Status:", response.status);
            console.log("API Response Headers:", Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const text = await response.text();
                console.error("API Error Response:", text.substring(0, 200));
                throw new Error(`Failed to fetch products: ${response.status}`);
            }

            const data = (await response.json()) as ProductsListResponse;
            const productList: ProductAPIResponse[] = data.products || [];

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
    }, [bootstrap, products.length]);

    React.useEffect(() => {
        if (bootstrap) {
            fetchProducts();
        }
    }, [bootstrap, fetchProducts]);

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
            });

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            fetchProducts();
            // Remove from selection if selected
            setSelectedIds(prev => prev.filter(sId => sId !== id));
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleBulkPublish = async () => {
        if (!confirm(`Are you sure you want to publish ${selectedIds.length} products?`)) return;

        setIsBulkPublishing(true);
        try {
            const response = await fetch(`${API_BASE}/api/products/bulk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ids: selectedIds,
                    action: "publish",
                }),
            });

            if (!response.ok) throw new Error("Bulk publish failed");

            await fetchProducts();
            setSelectedIds([]); // Clear selection
        } catch (error) {
            console.error("Bulk publish failed:", error);
            alert("Failed to publish products");
        } finally {
            setIsBulkPublishing(false);
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
            {bootstrapError && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                    {bootstrapError}
                </div>
            )}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
                    <p className="text-sm text-muted-foreground">
                        Keep your catalog tidy and stay on top of stock.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {selectedIds.length > 0 && (
                        <Button
                            onClick={handleBulkPublish}
                            disabled={isBulkPublishing}
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                            {isBulkPublishing ? "Publishing..." : `Publish Selected (${selectedIds.length})`}
                        </Button>
                    )}
                    <AddProductButton
                        onUploadClick={() => setUploadModalOpen(true)}
                        onInstagramClick={() => {
                            // TODO: Instagram import
                        }}
                    />
                </div>
            </div>

            <ProductStats
                totalProducts={products.length}
                activeNow={activeCount}
                newProducts={draftCount}
                lowStock={lowStockCount}
                isLoading={isLoading || isBootstrapping}
            />

            <div className="rounded-md border bg-card p-2 sm:p-4">
                <ProductTable
                    products={products}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onGenerateVariants={handleGenerateVariants}
                    isLoading={isLoading || isBootstrapping}
                />
            </div>

            {/* Upload Modal */}
            <UploadModal
                open={uploadModalOpen}
                onOpenChange={setUploadModalOpen}
                storeId={bootstrap?.storeId || ""}
                tenantId={bootstrap?.tenantId || ""}
                onUploadComplete={fetchProducts}
            />

            {/* Manual Add Modal */}
            {addManualOpen && (
                <AddProduct
                    storeId={bootstrap?.storeId || ""}
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
                tenantId={bootstrap?.tenantId || ""}
                onProductUpdated={fetchProducts}
            />
        </div>
    );
}