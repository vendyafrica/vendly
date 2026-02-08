"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ImageUpload01Icon, Cancel01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
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
import { useTenant } from "../../tenant-context";

interface UploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    storeId: string;
    tenantId: string;
    onUploadComplete?: () => void;
}

interface FilePreview {
    file: File;
    previewUrl: string;
    isUploading: boolean;
    url?: string;
    pathname?: string;
    error?: string;
}

const API_BASE = "";

export function UploadModal({
    open,
    onOpenChange,
    storeId,
    tenantId,
    onUploadComplete,
}: UploadModalProps) {
    const { bootstrap } = useTenant();
    const currency = bootstrap?.defaultCurrency || "UGX";

    const [files, setFiles] = React.useState<FilePreview[]>([]);
    const [isUploading, setIsUploading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const filesRef = React.useRef<FilePreview[]>([]);
    React.useEffect(() => {
        filesRef.current = files;
    }, [files]);

    const [productName, setProductName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [priceAmount, setPriceAmount] = React.useState<string>("");
    const [quantity, setQuantity] = React.useState<string>("");

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const addSelectedFiles = (selectedFiles: File[]) => {
        if (!selectedFiles.length) return;
        const newPreviews = selectedFiles.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            isUploading: false,
        }));
        setFiles((prev) => [...prev, ...newPreviews]);
        setError(null);

        // Reset input so the same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        addSelectedFiles(selectedFiles);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].previewUrl);
            updated.splice(index, 1);
            return updated;
        });
    };

    const moveFile = (from: number, to: number) => {
        setFiles((prev) => {
            if (to < 0 || to >= prev.length) return prev;
            const updated = [...prev];
            const [moved] = updated.splice(from, 1);
            updated.splice(to, 0, moved);
            return updated;
        });
    };

    const uploadFilesIfNeeded = async () => {
        const indicesToUpload = files
            .map((f, index) => ({ f, index }))
            .filter(({ f }) => !f.url);

        if (indicesToUpload.length === 0) return;

        // Validate required context
        if (!storeId || !tenantId) {
            throw new Error("Missing store context. Please complete onboarding first or reload the page.");
        }

        setIsUploading(true);
        setError(null);

        setFiles((prev) =>
            prev.map((f) => ({
                ...f,
                isUploading: !f.url,
            }))
        );

        try {
            const { upload } = await import("@vercel/blob/client");

            const MAX_CONCURRENCY = 5;
            let nextIndex = 0;

            const uploadResults: Record<number, { ok: true } | { ok: false; error: string }> = {};

            const workers = Array.from(
                { length: Math.min(MAX_CONCURRENCY, indicesToUpload.length) },
                async () => {
                    while (nextIndex < indicesToUpload.length) {
                        const current = nextIndex;
                        nextIndex += 1;

                        const { index, f } = indicesToUpload[current];
                        const file = f.file;

                        try {
                            const timestamp = Date.now();
                            const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
                            const path = `tenants/${tenantId}/products/${cleanName}-${timestamp}`;

                            const blob = await upload(path, file, {
                                access: "public",
                                handleUploadUrl: "/api/upload",
                            });

                            setFiles((prev) => {
                                const updated = [...prev];
                                if (!updated[index]) return prev;
                                updated[index] = {
                                    ...updated[index],
                                    url: blob.url,
                                    pathname: blob.pathname,
                                    isUploading: false,
                                    error: undefined,
                                };
                                return updated;
                            });

                            uploadResults[index] = { ok: true };
                        } catch (err) {
                            const message = err instanceof Error ? err.message : String(err);
                            console.error(`Failed to upload ${file.name}:`, err);
                            setError(`Failed to upload ${file.name}: ${message}`);
                            setFiles((prev) => {
                                const updated = [...prev];
                                if (!updated[index]) return prev;
                                updated[index] = {
                                    ...updated[index],
                                    isUploading: false,
                                    error: message,
                                };
                                return updated;
                            });

                            uploadResults[index] = { ok: false, error: message };
                        }
                    }
                }
            );

            await Promise.all(workers);

            const anyFailed = indicesToUpload.some(({ index }) => {
                const res = uploadResults[index];
                return !res || res.ok === false;
            });

            if (anyFailed) {
                const firstFailedIndex = indicesToUpload
                    .map(({ index }) => index)
                    .find((idx) => uploadResults[idx]?.ok === false);
                const firstFailure = firstFailedIndex !== undefined ? uploadResults[firstFailedIndex] : undefined;
                const failureMessage = firstFailure && firstFailure.ok === false
                    ? `Some uploads failed: ${firstFailure.error}`
                    : "Some uploads failed. Please remove failed items and try again.";
                throw new Error(failureMessage);
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveProduct = async () => {
        if (files.length === 0) {
            setError("Please select at least one file");
            return;
        }

        if (!productName.trim()) {
            setError("Product name is required");
            return;
        }

        if (!description.trim()) {
            setError("Product description is required");
            return;
        }

        if (!priceAmount || Number.isNaN(Number(priceAmount))) {
            setError("Product price is required");
            return;
        }

        if (quantity && Number.isNaN(Number(quantity))) {
            setError("Quantity must be a number");
            return;
        }

        try {
            await uploadFilesIfNeeded();

            const media = files
                .filter((f) => f.url && f.pathname)
                .map((f) => ({
                    url: f.url as string,
                    pathname: f.pathname as string,
                    contentType: f.file.type || "application/octet-stream",
                }));

            if (media.length === 0) {
                throw new Error("No uploaded media found. Please try again.");
            }

            const response = await fetch(`${API_BASE}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    storeId,
                    title: productName.trim(),
                    description: description.trim(),
                    priceAmount: Math.max(0, Math.floor(Number(priceAmount))),
                    currency,
                    quantity: quantity ? Math.max(0, Math.floor(Number(quantity))) : 0,
                    source: "manual",
                    status: "draft",
                    media,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || "Failed to create product");
            }

            // Clear and close
            files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
            setFiles([]);
            setProductName("");
            setDescription("");
            setPriceAmount("");
            setQuantity("");
            setError(null);
            onOpenChange(false);
            onUploadComplete?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
        }
    };

    const handleClose = () => {
        if (isUploading) return;
        files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
        setFiles([]);
        setError(null);
        setProductName("");
        setDescription("");
        setPriceAmount("");
        setQuantity("");
        onOpenChange(false);
    };

    const handleDialogOpenChange = (nextOpen: boolean) => {
        if (nextOpen) {
            onOpenChange(true);
            return;
        }
        handleClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogContent className="sm:max-w-3xl" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Upload images or videos for one product. Each file is a variant media item. Finish details before adding another product.
                    </p>

                    {error && (
                        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                            {error}
                        </p>
                    )}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Gallery / drop zone */}
                        <div
                            className="border-2 border-dashed border-border/70 rounded-lg p-4 md:p-5 lg:p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isUploading && e.dataTransfer.files?.length) {
                                    addSelectedFiles(Array.from(e.dataTransfer.files));
                                }
                            }}
                        >
                            {files.length === 0 ? (
                                <div className="text-center py-10">
                                    <HugeiconsIcon
                                        icon={ImageUpload01Icon}
                                        className="size-14 mx-auto text-muted-foreground"
                                    />
                                    <p className="text-sm text-muted-foreground mt-3 font-medium">
                                        Drag & drop product media here
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Images or videos up to 10MB each
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-4"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                        disabled={isUploading}
                                    >
                                        Upload media
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Featured image */}
                                    <div className="relative aspect-square max-h-80 mx-auto">
                                        {files[0].file.type.startsWith("video/") ? (
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
                                                    className={`object-contain rounded-md transition-opacity ${files[0].isUploading ? "opacity-60" : "opacity-100"}`}
                                                />
                                            </div>
                                        )}
                                        {files[0].isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="size-10 rounded-full bg-background/80 flex items-center justify-center">
                                                    <div className="size-7 rounded-full border-2 border-primary/60 border-t-primary animate-spin" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Thumbnail strip */}
                                    <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                                        {files.map((f, i) => (
                                            <div
                                                key={i}
                                                className={`relative aspect-square cursor-pointer border-2 rounded-md ${i === 0 ? "border-primary" : "border-transparent hover:border-border"}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (i !== 0) moveFile(i, 0);
                                                }}
                                            >
                                                {f.file.type.startsWith("video/") ? (
                                                    <video
                                                        src={f.previewUrl}
                                                        className={`h-full w-full rounded-md object-cover transition-opacity ${f.isUploading ? "opacity-60" : "opacity-100"}`}
                                                        muted
                                                        playsInline
                                                    />
                                                ) : (
                                                    <Image
                                                        src={f.previewUrl}
                                                        alt="Preview"
                                                        fill
                                                        className={`object-cover rounded-md transition-opacity ${f.isUploading ? "opacity-60" : "opacity-100"}`}
                                                    />
                                                )}
                                                {f.isUploading && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="size-5 rounded-full border-2 border-white/60 border-t-white animate-spin" />
                                                    </div>
                                                )}

                                                {!isUploading && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFile(i);
                                                        }}
                                                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-sm"
                                                    >
                                                        <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {/* Add more tile */}
                                        <button
                                            type="button"
                                            className="relative aspect-square border-2 border-dashed border-border/70 rounded-md flex items-center justify-center hover:bg-muted/10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current?.click();
                                            }}
                                            disabled={isUploading}
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
                                accept="image/*,video/*"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={isUploading}
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
                                    disabled={isUploading}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="priceAmount">Price ({currency})</Label>
                                    <Input
                                        id="priceAmount"
                                        value={priceAmount}
                                        onChange={(e) => setPriceAmount(e.target.value)}
                                        placeholder="0"
                                        type="number"
                                        min="0"
                                        disabled={isUploading}
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
                                        disabled={isUploading}
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
                                    disabled={isUploading}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isUploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveProduct}
                        disabled={isUploading || files.length === 0}
                    >
                        {isUploading ? (
                            <>
                                <HugeiconsIcon
                                    icon={Loading03Icon}
                                    className="size-4 mr-2 animate-spin"
                                />
                                Uploading...
                            </>
                        ) : (
                            "Save Product"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
