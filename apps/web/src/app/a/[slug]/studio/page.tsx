"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ComputerIcon,
    SmartPhone02Icon,
    LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";

type DeviceType = "desktop" | "mobile";

const MOBILE_DIMENSIONS = {
    width: 375,
    height: 812,
};

export default function StudioPage() {
    const params = useParams();
    const storeSlug = params?.slug as string;

    const [device, setDevice] = useState<DeviceType>("desktop");
    const [isLoading, setIsLoading] = useState(true);

    const storefrontUrl =
        process.env.NODE_ENV === "production"
            ? `https://${storeSlug}.vendlyafrica.store`
            : `http://localhost:3000/${storeSlug}`;

    return (
        <div className="relative h-screen w-full bg-transparent">
            <div className="absolute inset-0">
                {/* Desktop Preview */}
                {device === "desktop" && (
                    <iframe
                        src={storefrontUrl}
                        title="Desktop Storefront Preview"
                        onLoad={() => setIsLoading(false)}
                        className="absolute inset-0 h-full w-full border-0 bg-white"
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
        </div>
    );
}
