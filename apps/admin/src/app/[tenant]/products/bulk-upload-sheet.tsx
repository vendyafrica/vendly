"use client";

import * as React from "react";
import { Button } from "@vendly/ui/components/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@vendly/ui/components/sheet";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@vendly/ui/components/table";
import { Badge } from "@vendly/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Upload01Icon, Delete01Icon, Image01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@vendly/ui/lib/utils";
import { createBulkProducts } from "./actions"; // We will create this next
import { useRouter } from "next/navigation";

interface BulkUploadSheetProps {
    tenantSlug: string;
}

interface DraftProduct {
    id: string; // Temporary ID for UI
    file: File;
    previewUrl: string;
    title: string;
    price: number;
    description: string;
    status: "draft" | "active";
}

export function BulkUploadSheet({ tenantSlug }: BulkUploadSheetProps) {
    const [open, setOpen] = React.useState(false);
    const [drafts, setDrafts] = React.useState<DraftProduct[]>([]);
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        const newDrafts: DraftProduct[] = Array.from(files).map((file) => ({
            id: Math.random().toString(36).substring(7),
            file,
            previewUrl: URL.createObjectURL(file),
            title: file.name.split(".").slice(0, -1).join("."), // Remove extension
            price: 0,
            description: "",
            status: "draft",
        }));

        setDrafts((prev) => [...prev, ...newDrafts]);
    };

    const updateDraft = (id: string, field: keyof DraftProduct, value: string | number) => {
        setDrafts((prev) =>
            prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
        );
    };

    const removeDraft = (id: string) => {
        setDrafts((prev) => prev.filter((d) => d.id !== id));
    };

    const handleSave = async () => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            drafts.forEach((draft, index) => {
                formData.append(`file_${index}`, draft.file);
                formData.append(`data_${index}`, JSON.stringify({
                    title: draft.title,
                    price: draft.price,
                    description: draft.description,
                    status: draft.status
                }));
            });
            formData.append("count", drafts.length.toString());

            await createBulkProducts(tenantSlug, formData);
            setOpen(false);
            setDrafts([]);
            // Optional: Trigger a refresh or toast
            window.location.reload();
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                render={
                    <Button variant="outline" className="gap-2">
                        <HugeiconsIcon icon={Upload01Icon} className="size-4" />
                        Bulk Upload
                    </Button>
                }
            />
            <SheetContent className="sm:max-w-[800px] flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle>Bulk Product Upload</SheetTitle>
                    <SheetDescription>
                        Drag and drop images to create multiple products at once.
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-6">
                    {/* Drop Zone */}
                    <div
                        className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleFiles(e.dataTransfer.files);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <HugeiconsIcon icon={Image01Icon} className="size-6 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <p className="font-medium">Click or drag images here</p>
                            <p className="text-xs text-muted-foreground">Supports JPG, PNG, WebP</p>
                        </div>
                    </div>

                    {/* Drafts List */}
                    {drafts.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Ready to Upload ({drafts.length})</h4>
                                <Button variant="ghost" size="sm" onClick={() => setDrafts([])} className="text-red-500 hover:text-red-600">
                                    Clear All
                                </Button>
                            </div>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Image</TableHead>
                                            <TableHead>Details</TableHead>
                                            <TableHead className="w-[100px]">Status</TableHead>
                                            <TableHead className="w-[40px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {drafts.map((draft) => (
                                            <TableRow key={draft.id}>
                                                <TableCell>
                                                    <div className="h-12 w-12 rounded overflow-hidden border bg-muted">
                                                        <img src={draft.previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-2">
                                                        <Input
                                                            value={draft.title}
                                                            onChange={(e) => updateDraft(draft.id, "title", e.target.value)}
                                                            placeholder="Product Title"
                                                            className="h-8"
                                                        />
                                                        <div className="flex gap-2">
                                                            <div className="relative w-24">
                                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                                                <Input
                                                                    type="number"
                                                                    value={draft.price}
                                                                    onChange={(e) => updateDraft(draft.id, "price", parseFloat(e.target.value) || 0)}
                                                                    className="h-8 pl-5"
                                                                    placeholder="0.00"
                                                                />
                                                            </div>
                                                            <Input
                                                                value={draft.description}
                                                                onChange={(e) => updateDraft(draft.id, "description", e.target.value)}
                                                                placeholder="Description (optional)"
                                                                className="h-8 flex-1"
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <select
                                                        className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                                                        value={draft.status}
                                                        onChange={(e) => updateDraft(draft.id, "status", e.target.value as any)}
                                                    >
                                                        <option value="draft">Draft</option>
                                                        <option value="active">Active</option>
                                                    </select>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon-sm" onClick={() => removeDraft(draft.id)}>
                                                        <HugeiconsIcon icon={Delete01Icon} className="size-4 text-muted-foreground hover:text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>

                <SheetFooter className="mt-auto pt-4 border-t">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isUploading || drafts.length === 0}>
                        {isUploading ? "Uploading..." : `Save ${drafts.length} Products`}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
