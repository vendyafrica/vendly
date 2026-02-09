"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, Cancel01Icon, ImageUpload01Icon } from "@hugeicons/core-free-icons";
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
import { Textarea } from "@vendly/ui/components/textarea";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { useTenant } from "../../tenant-context";
import type { ProductApiRow } from "@/hooks/use-products";

interface Product {
    id: string;
    productName: string;
    description?: string;
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
    onProductUpdated?: (product?: ProductApiRow) => void;
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
    const { bootstrap } = useTenant();
    const storeCurrency = bootstrap?.defaultCurrency || "UGX";

    const [productName, setProductName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [priceAmount, setPriceAmount] = React.useState<string>("");
    const [quantity, setQuantity] = React.useState<string>("");
    const [isSaving, setIsSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Image management
    const [files, setFiles] = React.useState<UploadedFile[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const initialMediaSignatureRef = React.useRef<string>("[]");

    // Populate form when product changes
    React.useEffect(() => {
        if (product) {
            setProductName(product.productName);
            setDescription(product.description || "");
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
            } catch (err) {
                const message = err instanceof Error ? err.message : "Upload failed";
                console.error("Upload failed", err);
                setError(`Failed to upload ${file.name}: ${message}`);
                setFiles(prev => {
                    const next = [...prev];
                    if (next[index]) next[index].isUploading = false;
                    return next;
                });
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

            const payload: Record<string, unknown> = {
                productName,
                description,
                priceAmount: priceValue,
                quantity: quantityValue,
                // preserve current status unless explicitly changed elsewhere
                status: product.status,
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
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update product");
            }

            const updatedProduct = (await response.json()) as ProductApiRow;

            onOpenChange(false);
            onProductUpdated?.(updatedProduct);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Update failed");
        } finally {
            setIsSaving(false);
        }
    };

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90svh] w-[95vw] flex-col gap-0 overflow-hidden p-0 sm:max-h-[85vh] sm:max-w-3xl sm:top-1/2 sm:-translate-y-1/2 top-[5svh] translate-y-0" showCloseButton={false}>
                <div className="border-b px-6 py-4">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {error && (
                            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </p>
                        )}

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Gallery / drop zone */}
                            <div
                                className="cursor-pointer rounded-lg border-2 border-dashed border-border/70 p-4 transition-colors hover:bg-muted/50 md:p-5 lg:p-6"
                                onClick={() => !isSaving && fileInputRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isSaving && e.dataTransfer.files?.length) {
                                        handleUploadFiles(Array.from(e.dataTransfer.files));
                                    }
                                }}
                            >
                                {files.length === 0 ? (
                                    <div className="py-10 text-center">
                                        <HugeiconsIcon
                                            icon={ImageUpload01Icon}
                                            className="mx-auto size-14 text-muted-foreground"
                                        />
                                        <p className="mt-3 text-sm font-medium text-muted-foreground">
                                            Drag & drop product media here
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Images up to 10MB each
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="mt-4"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current?.click();
                                            }}
                                            disabled={isSaving}
                                        >
                                            Upload media
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Featured image */}
                                        <div className="relative mx-auto aspect-square max-h-80">
                                            {files[0].contentType.startsWith("video/") ? (
                                                <video
                                                    src={files[0].previewUrl}
                                                    className={`h-full w-full rounded-md object-cover transition-opacity ${files[0].isUploading ? "opacity-60" : "opacity-100"}`}
                                                    muted
                                                    playsInline
                                                    controls
                                                />
                                            ) : (
                                                <div className="relative h-full w-full">
                                                    <Image
                                                        src={files[0].previewUrl}
                                                        alt="Featured preview"
                                                        fill
                                                        className={`rounded-md object-contain transition-opacity ${files[0].isUploading ? "opacity-60" : "opacity-100"}`}
                                                    />
                                                </div>
                                            )}
                                            {files[0].isUploading && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="flex size-10 items-center justify-center rounded-full bg-background/80">
                                                        <div className="size-7 animate-spin rounded-full border-2 border-primary/60 border-t-primary" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Thumbnail strip */}
                                        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                                            {files.map((f, i) => (
                                                <div
                                                    key={i}
                                                    className={`relative aspect-square cursor-pointer rounded-md border-2 ${i === 0 ? "border-primary" : "border-transparent hover:border-border"}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (i !== 0) {
                                                            setFiles((prev) => {
                                                                const updated = [...prev];
                                                                const [moved] = updated.splice(i, 1);
                                                                updated.unshift(moved);
                                                                return updated;
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Image
                                                        src={f.previewUrl}
                                                        alt="Preview"
                                                        fill
                                                        className={`rounded-md object-cover transition-opacity ${f.isUploading ? "opacity-60" : "opacity-100"}`}
                                                    />
                                                    {f.isUploading && (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="size-5 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                                                        </div>
                                                    )}

                                                    {!isSaving && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeFile(i);
                                                            }}
                                                            className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground shadow-sm"
                                                        >
                                                            <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Add more tile */}
                                            <button
                                                type="button"
                                                className="relative flex aspect-square items-center justify-center rounded-md border-2 border-dashed border-border/70 hover:bg-muted/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    fileInputRef.current?.click();
                                                }}
                                                disabled={isSaving}
                                            >
                                                <HugeiconsIcon icon={ImageUpload01Icon} className="size-5 text-muted-foreground" />
                                                <span className="sr-only">Add more media</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={isSaving}
                                />
                            </div>

                            {/* Details */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="productName">Product Name</Label>
                                    <Input
                                        id="productName"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder="e.g. Black Hoodie"
                                        required
                                        disabled={isSaving}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="priceAmount">Price ({storeCurrency})</Label>
                                        <Input
                                            id="priceAmount"
                                            value={priceAmount}
                                            onChange={(e) => setPriceAmount(e.target.value)}
                                            placeholder="0"
                                            type="number"
                                            min="0"
                                            disabled={isSaving}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Input
                                            id="quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            placeholder="0"
                                            type="number"
                                            min="0"
                                            disabled={isSaving}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe the product..."
                                        rows={5}
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t bg-background px-6 py-4">
                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving || files.some(f => f.isUploading)} onClick={handleSubmit}>
                            {isSaving ? (
                                <>
                                    <HugeiconsIcon icon={Loading03Icon} className="mr-2 size-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save changes"
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
