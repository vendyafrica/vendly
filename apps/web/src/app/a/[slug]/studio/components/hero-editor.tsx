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
    currentHeroMedia?: string | null;
    currentHeroMediaType?: "image" | "video" | null;
    onUpdate: (heroMedia: string, heroMediaType: "image" | "video") => void;
}

export function HeroEditor({ 
    storeSlug, 
    tenantId,
    currentHeroMedia, 
    currentHeroMediaType,
    onUpdate 
}: HeroEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { uploadFile, isUploading } = useUpload();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsSaving(true);
            
            // Upload the file
            if (!tenantId) {
                alert("Store is still loading. Please try again in a moment.");
                return;
            }

            const blob = await uploadFile(file, `tenants/${tenantId}/hero`);
            
            // Determine media type
            const mediaType = file.type.startsWith("video/") ? "video" : "image";
            
            // Update the store
            const response = await fetch(`/api/storefront/${storeSlug}/hero`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    heroMedia: blob.url,
                    heroMediaType: mediaType,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update hero media");
            }

            onUpdate(blob.url, mediaType);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to upload hero media:", error);
            alert("Failed to upload hero media. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemove = async () => {
        if (!confirm("Are you sure you want to remove the hero media?")) return;

        try {
            setIsSaving(true);
            
            const response = await fetch(`/api/storefront/${storeSlug}/hero`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    heroMedia: null,
                    heroMediaType: null,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to remove hero media");
            }

            onUpdate("", "image");
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to remove hero media:", error);
            alert("Failed to remove hero media. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const hasHeroMedia = currentHeroMedia && currentHeroMedia !== "";

    return (
        <div className="relative group">
            {/* Hero Display */}
            <div className="relative h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] w-full overflow-hidden rounded-b-3xl">
                {hasHeroMedia ? (
                    currentHeroMediaType === "video" ? (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        >
                            <source src={currentHeroMedia} type="video/mp4" />
                        </video>
                    ) : (
                        <Image
                            src={currentHeroMedia}
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

                                {hasHeroMedia && (
                                    <Button
                                        variant="outline"
                                        onClick={handleRemove}
                                        disabled={isSaving}
                                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <HugeiconsIcon icon={Delete02Icon} size={20} className="mr-2" />
                                        Remove Current
                                    </Button>
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
