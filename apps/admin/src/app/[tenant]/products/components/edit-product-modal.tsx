"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@vendly/ui/components/dialog";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import Image from "next/image";

interface Product {
    id: string;
    productName: string;
    priceAmount: number;
    currency: string;
    quantity: number;
    status: string;
    thumbnailUrl?: string;
    salesAmount?: number;
}

interface EditProductModalProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tenantId: string;
    onProductUpdated?: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function EditProductModal({
    product,
    open,
    onOpenChange,
    tenantId,
    onProductUpdated,
}: EditProductModalProps) {
    const [productName, setProductName] = React.useState("");
    const [priceAmount, setPriceAmount] = React.useState<string>("");
    const [quantity, setQuantity] = React.useState<string>("");
    const [isSaving, setIsSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Populate form when product changes
    React.useEffect(() => {
        if (product) {
            setProductName(product.productName);
            setPriceAmount(product.priceAmount ? String(product.priceAmount) : "");
            setQuantity(product.quantity ? String(product.quantity) : "");
            setError(null);
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        setIsSaving(true);
        setError(null);

        try {
            const priceValue = Math.round(Number(priceAmount || 0));
            const quantityValue = Number(quantity || 0);

            const response = await fetch(`${API_BASE}/api/products/${product.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-tenant-id": tenantId,
                },
                body: JSON.stringify({
                    productName,
                    priceAmount: priceValue,
                    quantity: quantityValue,
                    status: "active", // Mark as published when done editing
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update product");
            }

            onOpenChange(false);
            onProductUpdated?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Update failed");
        } finally {
            setIsSaving(false);
        }
    };

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Thumbnail preview */}
                    {product.thumbnailUrl && (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-muted">
                            <Image
                                src={product.thumbnailUrl}
                                alt={product.productName}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                            {error}
                        </p>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                            id="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (KES)</Label>
                            <Input
                                id="price"
                                type="text"
                                value={priceAmount}
                                onChange={(e) => setPriceAmount(e.target.value)}
                                placeholder="Enter price"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="text"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Enter quantity"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <HugeiconsIcon icon={Loading03Icon} className="size-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Done"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
