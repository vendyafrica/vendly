"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Upload04Icon, Cancel01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@vendly/ui/components/dialog";
import { Button } from "@vendly/ui/components/button";
import { Progress } from "@vendly/ui/components/progress";
import Image from "next/image";

interface UploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    storeId: string;
    tenantId: string;
    storeSlug: string;
    onUploadComplete?: () => void;
}

interface FilePreview {
    file: File;
    previewUrl: string;
}

const API_BASE = "";

export function UploadModal({
    open,
    onOpenChange,
    storeId,
    tenantId,
    storeSlug,
    onUploadComplete,
}: UploadModalProps) {
    const [files, setFiles] = React.useState<FilePreview[]>([]);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [error, setError] = React.useState<string | null>(null);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const newPreviews = selectedFiles.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setFiles((prev) => [...prev, ...newPreviews]);
        setError(null);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].previewUrl);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setError("Please select at least one image");
            return;
        }

        // Validate required context
        if (!storeId || !tenantId) {
            setError("Missing store context. Please complete onboarding first or reload the page.");
            console.error("Upload failed: storeId=", storeId, "tenantId=", tenantId);
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setError(null);

        try {
            // 1. Upload files to Vercel Blob
            const uploadedItems: Array<{ url: string; pathname: string; contentType: string; filename: string }> = [];
            const totalFiles = files.length;

            const { upload } = await import("@vercel/blob/client");

            // Upload with limited concurrency (faster than sequential, safer than unlimited)
            const MAX_CONCURRENCY = 5;
            const results: Array<
                | { url: string; pathname: string; contentType: string; filename: string }
                | null
            > = new Array(totalFiles).fill(null);

            let completed = 0;
            const updateProgress = () => {
                // Reserve first 80% of bar for uploads
                setUploadProgress(Math.round((completed / totalFiles) * 80));
            };

            const uploadOne = async (index: number) => {
                const file = files[index].file;

                try {
                    // Construct path: tenants/{tenantId}/products/{filename}
                    const timestamp = Date.now();
                    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
                    const path = `tenants/${tenantId}/products/${cleanName}-${timestamp}`;

                    const blob = await upload(path, file, {
                        access: "public",
                        handleUploadUrl: "/api/upload",
                    });

                    results[index] = {
                        url: blob.url,
                        pathname: blob.pathname,
                        contentType: file.type,
                        filename: file.name
                    };
                } catch (err) {
                    console.error(`Failed to upload ${file.name}:`, err);
                    results[index] = null;
                } finally {
                    completed += 1;
                    updateProgress();
                }
            };

            // Promise pool
            let nextIndex = 0;
            const workers = Array.from({ length: Math.min(MAX_CONCURRENCY, totalFiles) }, async () => {
                while (nextIndex < totalFiles) {
                    const current = nextIndex;
                    nextIndex += 1;
                    await uploadOne(current);
                }
            });

            await Promise.all(workers);

            uploadedItems.push(...results.filter((r): r is NonNullable<typeof r> => Boolean(r)));

            if (uploadedItems.length === 0) {
                throw new Error("All file uploads failed. Please try again.");
            }

            // 2. Create products with uploaded media
            setUploadProgress(90); // Saving state

            const response = await fetch(`${API_BASE}/api/products/bulk-create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-tenant-id": tenantId,
                    "x-store-slug": storeSlug,
                },
                body: JSON.stringify({
                    storeId,
                    items: uploadedItems,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create products");
            }

            setUploadProgress(100);

            // Brief delay to show 100%
            await new Promise((r) => setTimeout(r, 500));

            // Clear and close
            files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
            setFiles([]);
            onOpenChange(false);
            onUploadComplete?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        if (isUploading) return;
        files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
        setFiles([]);
        setError(null);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Upload Product Images</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Upload up to 20 images at once. Each image will create a draft product.
                    </p>

                    {error && (
                        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                            {error}
                        </p>
                    )}

                    {/* Drop zone */}
                    <div
                        className="border-2 border-dashed border-border/70 rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                    >
                        <HugeiconsIcon
                            icon={Upload04Icon}
                            className="size-12 mx-auto text-muted-foreground"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                            Click to select images or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, WEBP up to 10MB each
                        </p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />

                    {/* Preview grid */}
                    {files.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">
                                {files.length} image{files.length > 1 ? "s" : ""} selected
                            </p>
                            <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                                {files.map((f, i) => (
                                    <div key={i} className="relative aspect-square">
                                        <Image
                                            src={f.previewUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                        {!isUploading && (
                                            <button
                                                type="button"
                                                onClick={() => removeFile(i)}
                                                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-sm"
                                            >
                                                <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Progress bar */}
                    {isUploading && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <HugeiconsIcon
                                    icon={Loading03Icon}
                                    className="size-4 animate-spin"
                                />
                                <span className="text-sm">Uploading...</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </div>
                    )}
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
                        onClick={handleUpload}
                        disabled={isUploading || files.length === 0}
                    >
                        {isUploading ? "Uploading..." : `Upload ${files.length} Images`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
