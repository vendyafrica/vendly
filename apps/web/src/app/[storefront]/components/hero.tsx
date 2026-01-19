"use client";

import Link from "next/link";
import Image from "next/image";
import { StoreHeroConfig } from "../../../types/store-config";
import { cn, themeClasses, animations } from "../../../lib/theme-utils";

interface HeroProps {
    config: StoreHeroConfig;
}

export function Hero({ config }: HeroProps) {
    const { headline, subheadline, backgroundImage, ctaText, ctaLink } = config;

    return (
        <section className={cn(
            "relative h-screen min-h-[600px] w-full",
            themeClasses.background.muted
        )}>
            {/* Background Image Container */}
            <div className="absolute inset-0">
                <Image
                    src={backgroundImage}
                    alt="Hero Background"
                    fill
                    priority
                    className="object-cover"
                />
                {/* Theme-aware overlay for text readability */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content Container */}
            <div className="relative h-full flex items-end pb-24 px-6 md:px-16 lg:px-24">
                <div className="max-w-2xl">
                    <p className="text-white/90 text-sm tracking-[0.2em] uppercase mb-4 font-medium">
                        {subheadline}
                    </p>
                    <h1 className="text-2xl sm:text-5xl md:text-6xl font-light text-white mb-8 leading-tight">
                        {headline.split('\n').map((line, i) => (
                            <span key={i} className="block">{line}</span>
                        ))}
                    </h1>
                    <Link
                        href={ctaLink}
                        className={cn(
                            "inline-block border-2 border-white text-white px-8 py-4 text-sm tracking-widest uppercase",
                            "rounded-(--radius)]",
                            "hover:bg-white hover:text-black",
                            animations.transition,
                            themeClasses.focus.ring
                        )}
                    >
                        {ctaText}
                    </Link>
                </div>
            </div>
        </section>
    );
}