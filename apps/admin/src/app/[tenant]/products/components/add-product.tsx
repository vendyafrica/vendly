"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Upload04Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
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

interface AddProductProps {
    storeId?: string;
    onProductCreated?: () => void;
}

interface FilePreview {
    file: File;
    previewUrl: string;
}

export function AddProduct({ storeId, onProductCreated }: AddProductProps) {
    const [open, setOpen] = React.useState(false);
    const [files, setFiles] = React.useState<FilePreview[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const newPreviews = selectedFiles.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setFiles((prev) => [...prev, ...newPreviews]);
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
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        files.forEach((f) => formData.append("files", f.file));

        try {
            // TODO: Implement API call
            console.log("Creating product:", Object.fromEntries(formData.entries()));
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
            <DialogTrigger render={<Button className="gap-2" />}>
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
                                placeholder="0"
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
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Product Images</Label>
                        <div
                            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <HugeiconsIcon icon={Upload04Icon} className="size-8 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mt-2">
                                Click to upload images
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {files.length > 0 && (
                            <div className="flex gap-2 flex-wrap mt-2">
                                {files.map((f, i) => (
                                    <div key={i} className="relative size-16">
                                        <Image
                                            src={f.previewUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
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
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}