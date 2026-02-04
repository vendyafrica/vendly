"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
    PlayIcon, 
    Image02Icon 
} from "@hugeicons/core-free-icons";
import { useUpload } from "@/hooks/use-upload";
import { CoverUpload } from "./cover-upload";

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
    const [isSaving, setIsSaving] = useState(false);
    const { uploadFile, isUploading } = useUpload();

    const handleCoverSelected = async (file: File | null) => {
        if (!file) return;

        try {
            setIsSaving(true);

            if (!tenantId) {
                alert("Store is still loading. Please try again in a moment.");
                return;
            }

            const blob = await uploadFile(file, `tenants/${tenantId}/hero`);
            const mediaType = file.type.startsWith("video/") ? "video" : "image";
            const coverItem = { url: blob.url, type: mediaType } as const;

            const rest = heroMediaItems.filter((_, idx) => idx !== 0);
            const nextItems = [coverItem, ...rest];

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
            </div>

            {/* Inline editor content */}
            <div className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/40 pointer-events-none" />

            <div className="bg-white rounded-xl p-6 shadow-lg mt-4">
                <h3 className="text-lg font-semibold mb-4">Update Hero Media</h3>

                <div className="space-y-4">
                    <CoverUpload
                        accept="image/*,video/*"
                        maxSize={10 * 1024 * 1024}
                        disabled={!tenantId || isUploading || isSaving}
                        title={!tenantId ? "Loading store..." : isUploading ? "Uploading..." : "Upload cover image or video"}
                        description="Drag & drop, or click to browse"
                        onFileSelected={handleCoverSelected}
                    />

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
                </div>
            </div>
        </div>
    );
}
