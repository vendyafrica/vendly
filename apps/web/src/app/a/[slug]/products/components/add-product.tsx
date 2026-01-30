"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Upload04Icon, Cancel01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@vendly/ui/components/dialog";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import Image from "next/image";
import { upload } from "@vercel/blob/client";

interface AddProductProps {
    storeId?: string;
    onProductCreated?: () => void;
}

interface UploadedFile {
    url: string;
    pathname: string;
    contentType: string;
    previewUrl: string; // local preview
    isUploading: boolean;
}

export function AddProduct({ storeId, onProductCreated }: AddProductProps) {
    const [open, setOpen] = React.useState(false);
    const [files, setFiles] = React.useState<UploadedFile[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Drag and drop state
    const [isDragging, setIsDragging] = React.useState(false);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleUploadFiles = async (selectedFiles: File[]) => {
        // Create placeholders first for immediate UI feedback
        const newFiles = selectedFiles.map(file => ({
            url: "",
            pathname: "",
            contentType: file.type,
            previewUrl: URL.createObjectURL(file), // immediate local preview
            isUploading: true
        }));

        setFiles(prev => [...prev, ...newFiles]);

        // Process uploads
        // We'll map the index from the end of the previous array
        const startIndex = files.length;

        await Promise.all(selectedFiles.map(async (file, i) => {
            const index = startIndex + i;
            // Construct path: tenants/{tenantId}/products/{filename}
            const timestamp = Date.now();
            const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const path = `tenants/${storeId}/products/${cleanName}-${timestamp}`;

            try {
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
                // Remove failed file
                setFiles(prev => prev.filter((_, idx) => idx !== index));
            }
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length > 0) {
            handleUploadFiles(selectedFiles);
        }
        // Reset input so same file can be selected again if needed
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
            URL.revokeObjectURL(updated[index].previewUrl);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Check if any files are still uploading
        if (files.some(f => f.isUploading)) {
            alert("Please wait for images to finish uploading.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const payload = {
            storeId: formData.get("storeId"),
            title: formData.get("title"),
            priceAmount: Number(formData.get("priceAmount")),
            quantity: Number(formData.get("quantity")),
            media: files.map(f => ({
                url: f.url,
                pathname: f.pathname,
                contentType: f.contentType
            }))
        };

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create product");

            onProductCreated?.();
            setOpen(false);
            setFiles([]);
        } catch (error) {
            console.error("Failed to create product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
            setFiles([]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger
                render={
                    <Button
                        className="gap-2 rounded-lg border border-border/70 bg-foreground text-background shadow-sm hover:bg-foreground/90"
                    />
                }
            >
                <HugeiconsIcon icon={Add01Icon} className="size-4" />
                Add Product
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="hidden" name="storeId" value={storeId} />

                    <div className="space-y-2">
                        <Label htmlFor="title">Product Name</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (KES)</Label>
                            <Input
                                id="price"
                                name="priceAmount"
                                type="number"
                                min="0"
                                placeholder="Enter price"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="0"
                                placeholder="Enter quantity"
                            />
                        </div>
                    </div>

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
                            <p className="text-sm text-muted-foreground mt-2 font-medium">
                                {isDragging ? "Drop images here" : "Click to upload or drag & drop"}
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                                SVG, PNG, JPG or GIF (max 5MB)
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

                    <DialogFooter className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || files.some(f => f.isUploading)}>
                            {isSubmitting ? (
                                <>
                                    <HugeiconsIcon icon={Loading03Icon} className="size-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Product"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}