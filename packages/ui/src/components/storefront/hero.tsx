import * as React from "react";
import { cn } from "../../lib/utils";

interface HeroProps {
    title: string;
    subtitle: string;
    align: "left" | "center";
    backgroundImage?: string;
    height?: "small" | "medium" | "large";
}

import Image from "next/image";

export function Hero({
    title,
    subtitle,
    align,
    backgroundImage,
    height = "medium"
}: HeroProps) {
    const heightClass = {
        small: "py-12 min-h-[300px]",
        medium: "py-24 min-h-[500px]",
        large: "py-32 min-h-[700px]",
    }[height];

    return (
        <div
            className={cn(
                "relative flex flex-col justify-center bg-gray-100",
                heightClass,
                align === "left" ? "items-start text-left px-12" : "items-center text-center px-4"
            )}
        >
            {backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={backgroundImage}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            )}


            <div className="relative z-10 max-w-4xl">
                <h1 className={cn("text-4xl md:text-5xl font-bold mb-4", backgroundImage ? "text-white" : "text-gray-900")}>
                    {title}
                </h1>
                <p className={cn("text-lg md:text-xl", backgroundImage ? "text-white/90" : "text-gray-600")}>
                    {subtitle}
                </p>
            </div>
        </div>
    );
}
