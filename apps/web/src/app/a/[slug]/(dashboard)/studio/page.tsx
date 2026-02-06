"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ComputerIcon,
    SmartPhone02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";
import { HeroEditor } from "./components/hero-editor";

type DeviceType = "desktop" | "mobile";

export default function StudioPage() {
    const params = useParams();
    const storeSlug = params?.slug as string;

    const [device, setDevice] = useState<DeviceType>("desktop");
    const [isLoading, setIsLoading] = useState(true);
    const [isEditingHero, setIsEditingHero] = useState(false);
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [heroMediaItems, setHeroMediaItems] = useState<Array<{ url: string; type: "image" | "video" }>>([]);
    const [iframeKey, setIframeKey] = useState(0);

    const storefrontUrl =
        process.env.NODE_ENV === "production"
            ? `https://${storeSlug}.vendlyafrica.store`
            : `http://localhost:3000/${storeSlug}`;

    useEffect(() => {
        // Fetch current store hero media
        const fetchStoreData = async () => {
            try {
                const response = await fetch(`/api/storefront/${storeSlug}`);
                if (response.ok) {
                    const store = await response.json();
                    setTenantId(store.tenantId ?? null);
                    setHeroMediaItems(Array.isArray(store.heroMediaItems) ? store.heroMediaItems : []);
                }
            } catch (error) {
                console.error("Failed to fetch store data:", error);
            }
        };
        fetchStoreData();
    }, [storeSlug]);

    const handleHeroUpdate = (items: Array<{ url: string; type: "image" | "video" }>) => {
        setHeroMediaItems(items);
        // Reload the iframe to reflect changes
        setIsLoading(true);
        setIframeKey((prev) => prev + 1);
    };

    return (
        <div className="relative h-screen w-full bg-transparent">
            {/* Hero Editor Overlay */}
            {isEditingHero && (
                <div className="absolute inset-0 z-50 bg-white">
                    <HeroEditor
                        storeSlug={storeSlug}
                        tenantId={tenantId}
                        heroMediaItems={heroMediaItems}
                        onUpdate={handleHeroUpdate}
                    />
                    <div className="absolute top-4 left-4">
                        <Button
                            onClick={() => setIsEditingHero(false)}
                            variant="outline"
                        >
                            Back to Preview
                        </Button>
                    </div>
                </div>
            )}

            <div className="absolute inset-0">
                {/* Desktop Preview */}
                {device === "desktop" && (
                    <iframe
                        key={iframeKey}
                        src={storefrontUrl}
                        title="Desktop Storefront Preview"
                        onLoad={() => setIsLoading(false)}
                        className="absolute inset-0 z-0 h-full w-full border-0 bg-white"
                    />
                )}

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-neutral-950">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-700 border-t-white" />
                            <span className="text-sm text-neutral-400">
                                Loading storefront…
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Studio Controls */}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg px-4 py-2 flex items-center gap-2">
                    <Button
                        onClick={() => setIsEditingHero(true)}
                        variant="ghost"
                        size="sm"
                        className="rounded-full"
                    >
                        Edit Hero
                    </Button>
                    <div className="w-px h-6 bg-neutral-200" />
                    <Button
                        onClick={() => setDevice("desktop")}
                        variant={device === "desktop" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full"
                    >
                        <HugeiconsIcon icon={ComputerIcon} size={18} />
                    </Button>
                    <Button
                        onClick={() => setDevice("mobile")}
                        variant={device === "mobile" ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full"
                    >
                        <HugeiconsIcon icon={SmartPhone02Icon} size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
