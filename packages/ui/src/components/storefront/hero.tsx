import * as React from "react";
import { cn } from "../../lib/utils";
import { Button, buttonVariants } from "../button";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
    title: string;
    subtitle?: string;
    align?: "left" | "center" | "right";
    backgroundImage?: string;
    height?: "small" | "medium" | "large" | "full";
    layout?: "full-image" | "split" | "minimal";
    ctaText?: string;
    ctaLink?: string;
    ctaVariant?: "default" | "outline" | "secondary";
    overlayOpacity?: number;
}

export function Hero({
    title,
    subtitle,
    align = "center",
    backgroundImage,
    height = "medium",
    layout = "full-image",
    ctaText,
    ctaLink,
    ctaVariant = "default",
    overlayOpacity = 40
}: HeroProps) {
    const heightClass = {
        small: "min-h-[300px]",
        medium: "min-h-[500px]",
        large: "min-h-[700px]",
        full: "min-h-screen",
    }[height];

    const alignmentClass = {
        left: "items-start text-left",
        center: "items-center text-center",
        right: "items-end text-right",
    }[align];

    // Split Layout
    if (layout === "split") {
        return (
            <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[var(--background,#fff)] overflow-hidden", heightClass)}>
                <div className={cn("px-8 md:px-16 flex flex-col justify-center", align === "center" ? "items-center text-center" : "items-start text-left")}>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[var(--foreground,#000)] font-heading">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg md:text-xl text-[var(--muted-foreground,#666)] mb-8 font-body max-w-lg">
                            {subtitle}
                        </p>
                    )}
                    {ctaText && ctaLink && (
                        <Link
                            href={ctaLink}
                            className={cn(buttonVariants({ variant: ctaVariant, size: "lg" }))}
                        >
                            {ctaText}
                        </Link>
                    )}
                </div>
                <div className="relative h-full min-h-[400px] w-full bg-gray-100">
                    {backgroundImage ? (
                        <Image
                            src={backgroundImage}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <span className="text-sm">No Image</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Full Image & Minimal Layouts
    return (
        <div
            className={cn(
                "relative flex flex-col justify-center px-6 md:px-12",
                heightClass,
                alignmentClass,
                layout === "minimal" ? "bg-[var(--secondary,#f4f4f5)]" : "bg-gray-900"
            )}
        >
            {layout === "full-image" && backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={backgroundImage}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div
                        className="absolute inset-0 bg-black"
                        style={{ opacity: overlayOpacity / 100 }}
                    />
                </div>
            )}

            <div className="relative z-10 max-w-4xl">
                <h1 className={cn(
                    "text-4xl md:text-6xl font-bold mb-6 font-heading",
                    layout === "full-image" ? "text-white" : "text-[var(--foreground,#000)]"
                )}>
                    {title}
                </h1>
                {subtitle && (
                    <p className={cn(
                        "text-lg md:text-2xl mb-8 font-body max-w-2xl mx-auto",
                        layout === "full-image" ? "text-white/90" : "text-[var(--muted-foreground,#666)]"
                    )}>
                        {subtitle}
                    </p>
                )}
                {ctaText && ctaLink && (
                    <Link
                        href={ctaLink}
                        className={cn(
                            buttonVariants({
                                variant: layout === "full-image" ? "default" : ctaVariant,
                                size: "lg"
                            }),
                            layout === "full-image" ? "bg-white text-black hover:bg-white/90 border-0" : ""
                        )}
                    >
                        {ctaText}
                    </Link>
                )}
            </div>
        </div>
    );
}
