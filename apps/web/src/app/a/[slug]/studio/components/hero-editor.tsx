"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
    Upload02Icon, 
    PlayIcon, 
    Image02Icon,
    Delete02Icon,
    Edit03Icon 
} from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";
import { useUpload } from "@/hooks/use-upload";

interface HeroEditorProps {
    storeSlug: string;
    tenantId: string | null;
    heroMediaItems: Array<{ url: string; type: "image" | "video" }>;
    onUpdate: (items: Array<{ url: string; type: "image" | "video" }>) => void;
}

export function HeroEditor({ 
    storeSlug, 
    tenantId,
    heroMediaItems,
    onUpdate 
}: HeroEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { uploadFile, isUploading } = useUpload();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (files.length === 0) return;

        try {
            setIsSaving(true);
            
            // Upload the file
            if (!tenantId) {
                alert("Store is still loading. Please try again in a moment.");
                return;
            }

            const uploadedItems: Array<{ url: string; type: "image" | "video" }> = [];
            for (const file of files) {
                const blob = await uploadFile(file, `tenants/${tenantId}/hero`);
                const mediaType = file.type.startsWith("video/") ? "video" : "image";
                uploadedItems.push({ url: blob.url, type: mediaType });
            }

            const nextItems = [...heroMediaItems, ...uploadedItems];

            const response = await fetch(`/api/storefront/${storeSlug}/hero`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    heroMediaItems: nextItems,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update hero media");
            }

            onUpdate(nextItems);
        } catch (error) {
            console.error("Failed to upload hero media:", error);
            alert("Failed to upload hero media. Please try again.");
        } finally {
            event.target.value = "";
            setIsSaving(false);
        }
    };

    const handleRemove = async (index: number) => {
        if (!confirm("Are you sure you want to remove this hero media item?")) return;

        try {
            setIsSaving(true);

            const nextItems = heroMediaItems.filter((_, i) => i !== index);

            const response = await fetch(`/api/storefront/${storeSlug}/hero`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    heroMediaItems: nextItems,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to remove hero media");
            }

            onUpdate(nextItems);
        } catch (error) {
            console.error("Failed to remove hero media:", error);
            alert("Failed to remove hero media. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const hasHeroMedia = heroMediaItems.length > 0;
    const firstItem = heroMediaItems[0];

    return (
        <div className="relative group">
            {/* Hero Display */}
            <div className="relative h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] w-full overflow-hidden rounded-b-3xl">
                {hasHeroMedia ? (
                    firstItem?.type === "video" ? (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src={firstItem.url} type="video/mp4" />
                        </video>
                    ) : (
                        <Image
                            src={firstItem.url}
                            alt="Store hero"
                            fill
                            priority
                            className="object-cover"
                        />
                    )
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                        <div className="text-center">
                            <HugeiconsIcon 
                                icon={Image02Icon} 
                                size={48} 
                                className="mx-auto mb-4 text-neutral-400" 
                            />
                            <p className="text-neutral-500 text-lg">No hero media</p>
                            <p className="text-neutral-400 text-sm mt-2">
                                Add a hero image or video to showcase your store
                            </p>
                        </div>
                    </div>
                )}

                {/* Overlay when editing */}
                {isEditing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">Update Hero Media</h3>
                            
                            <div className="space-y-3">
                                <label className="block">
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={handleFileSelect}
                                        disabled={!tenantId || isUploading || isSaving}
                                        className="hidden"
                                        id="hero-file-input"
                                    />
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        disabled={!tenantId || isUploading || isSaving}
                                    >
                                        <label htmlFor="hero-file-input" className="cursor-pointer flex items-center justify-center gap-2">
                                            <HugeiconsIcon icon={Upload02Icon} size={20} />
                                            {!tenantId
                                                ? "Loading store..."
                                                : isUploading
                                                    ? "Uploading..."
                                                    : "Choose New Media"}
                                        </label>
                                    </Button>
                                </label>

                                {heroMediaItems.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {heroMediaItems.slice(0, 6).map((item, idx) => (
                                            <button
                                                key={`${item.url}-${idx}`}
                                                type="button"
                                                onClick={() => handleRemove(idx)}
                                                disabled={isSaving}
                                                className="relative aspect-square overflow-hidden rounded-md border border-border/60"
                                            >
                                                {item.type === "video" ? (
                                                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                                                        <HugeiconsIcon icon={PlayIcon} size={18} className="text-neutral-500" />
                                                    </div>
                                                ) : (
                                                    <Image src={item.url} alt="Hero item" fill className="object-cover" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <Button
                                    variant="ghost"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isSaving}
                                    className="w-full"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Button */}
                <Button
                    onClick={() => setIsEditing(true)}
                    className="absolute top-4 right-4 z-20 shadow-lg"
                    size="sm"
                    variant="default"
                >
                    <HugeiconsIcon icon={Edit03Icon} size={16} className="mr-2" />
                    Edit Hero
                </Button>
            </div>
        </div>
    );
}
