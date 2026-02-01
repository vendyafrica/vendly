"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, Upload04Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
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
import { upload } from "@vercel/blob/client";

interface Product {
    id: string;
    productName: string;
    priceAmount: number;
    currency: string;
    quantity: number;
    status: string;
    thumbnailUrl?: string;
    salesAmount?: number;
    media?: {
        id?: string;
        blobUrl: string;
        contentType?: string;
        blobPathname?: string;
    }[];
}

interface EditProductModalProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tenantId: string;
    onProductUpdated?: () => void;
}

interface UploadedFile {
    url: string;
    pathname: string;
    contentType: string;
    previewUrl: string;
    isUploading: boolean;
    isNew: boolean;
}

const API_BASE = "";

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

    // Image management
    const [files, setFiles] = React.useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const initialMediaSignatureRef = React.useRef<string>("[]");

    // Populate form when product changes
    React.useEffect(() => {
        if (product) {
            setProductName(product.productName);
            setPriceAmount(product.priceAmount ? String(product.priceAmount) : "");
            setQuantity(product.quantity ? String(product.quantity) : "");

            // Map existing media to display
            const existingMedia: UploadedFile[] = (product.media || []).map(m => ({
                url: m.blobUrl,
                pathname: m.blobPathname || "",
                contentType: m.contentType || "image/jpeg",
                previewUrl: m.blobUrl,
                isUploading: false,
                isNew: false
            }));

            // If no media but thumbnail exists, add thumbnail
            if (existingMedia.length === 0 && product.thumbnailUrl) {
                existingMedia.push({
                    url: product.thumbnailUrl,
                    pathname: "",
                    contentType: "image/jpeg",
                    previewUrl: product.thumbnailUrl,
                    isUploading: false,
                    isNew: false
                });
            }

            setFiles(existingMedia);
            initialMediaSignatureRef.current = JSON.stringify(
                existingMedia.map((m) => ({
                    url: m.url,
                    pathname: m.pathname,
                    contentType: m.contentType,
                }))
            );
            setError(null);
        }
    }, [product]);

    const handleUploadFiles = async (selectedFiles: File[]) => {
        const newFiles = selectedFiles.map(file => ({
            url: "",
            pathname: "",
            contentType: file.type,
            previewUrl: URL.createObjectURL(file),
            isUploading: true,
            isNew: true
        }));

        setFiles(prev => [...prev, ...newFiles]);

        const startIndex = files.length;

        await Promise.all(selectedFiles.map(async (file, i) => {
            const index = startIndex + i;
            try {
                // Construct path: tenants/{tenantId}/products/{filename}
                const timestamp = Date.now();
                const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
                const path = `tenants/${tenantId}/products/${cleanName}-${timestamp}`;

                const blob = await upload(path, file, {
                    access: "public",
                    handleUploadUrl: "/api/upload",
                });

                setFiles(prev => {
                    const updated = [...prev];
                    if (updated[index]) {
                        updated[index] = {
                            ...updated[index],
                            url: blob.url,
                            pathname: blob.pathname,
                            isUploading: false
                        };
                    }
                    return updated;
                });
            } catch (error) {
                console.error("Upload failed", error);
                setFiles(prev => prev.filter((_, idx) => idx !== index));
            }
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length > 0) {
            handleUploadFiles(selectedFiles);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            handleUploadFiles(droppedFiles);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => {
            const updated = [...prev];
            // Only revoke created object URLs, not remote ones
            if (updated[index].isNew) {
                URL.revokeObjectURL(updated[index].previewUrl);
            }
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || isSaving) return;

        if (files.some(f => f.isUploading)) {
            alert("Please wait for images to finish uploading.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const priceValue = Math.round(Number(priceAmount || 0));
            const quantityValue = Number(quantity || 0);

            // Separate newly added media logic if needed in backend, 
            // but for now we might only send basic info.
            // NOTE: The current PATCH endpoint (as per previous files) only updates fields.
            // We need to support updating media.
            // For now, we'll just update basic fields as before, plus send new media if the endpoint supports it.
            // We should ideally update PATCH endpoint to handle media updates (add/remove).
            // Assuming we refactored PATCH API? Not yet. 
            // Strategy: Send new media in a separate array or 'media' field if supported.
            // The existing PATCH logic only handled: productName, priceAmount, quantity, status.

            // We'll update the PATCH payload to include media URLs
            // Backend PATCH needs to be updated to sync media.

            const payload: Record<string, any> = {
                productName,
                priceAmount: priceValue,
                quantity: quantityValue,
                status: "active",
            };

            const currentMediaSignature = JSON.stringify(
                files.map((f) => ({
                    url: f.url,
                    pathname: f.pathname,
                    contentType: f.contentType,
                }))
            );

            // Only send media if it actually changed; otherwise we avoid expensive media sync in the backend.
            if (currentMediaSignature !== initialMediaSignatureRef.current) {
                payload.media = files.map((f) => ({
                    url: f.url,
                    pathname: f.pathname,
                    contentType: f.contentType,
                }));
            }

            const response = await fetch(`${API_BASE}/api/products/${product.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-tenant-id": tenantId,
                },
                body: JSON.stringify(payload),
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
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Management */}
                    <div className="space-y-2">
                        <Label>Product Images</Label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
                                ? "border-primary bg-primary/5"
                                : "border-border/70 hover:bg-muted/50"
                                }`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <HugeiconsIcon icon={Upload04Icon} className="size-8 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mt-2">
                                Click or drag to add images
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {files.length > 0 && (
                            <div className="grid grid-cols-4 gap-3 mt-3">
                                {files.map((f, i) => (
                                    <div key={i} className="relative aspect-square group">
                                        <Image
                                            src={f.previewUrl}
                                            alt="Preview"
                                            fill
                                            className={`object-cover rounded-md transition-opacity ${f.isUploading ? 'opacity-50' : 'opacity-100'}`}
                                        />
                                        {f.isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <HugeiconsIcon icon={Loading03Icon} className="size-5 animate-spin text-white" />
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile(i);
                                            }}
                                            className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (KES)</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                value={priceAmount}
                                onChange={(e) => setPriceAmount(e.target.value)}
                                placeholder="Enter price"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="0"
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
                        <Button type="submit" disabled={isSaving || files.some(f => f.isUploading)}>
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
