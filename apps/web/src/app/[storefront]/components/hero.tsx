"use client";

import Link from "next/link";
import Image from "next/image";
import { StoreHeroConfig } from "@vendly/ui/src/types/store-config";

interface HeroProps {
    config: StoreHeroConfig;
}

export function Hero({ config }: HeroProps) {
    const { headline, subheadline, backgroundImage, ctaText, ctaLink } = config;

    return (
        <section className="relative h-screen min-h-[600px] w-full bg-neutral-900">
            {/* Background Image Container */}
            <div className="absolute inset-0">
                <Image
                    src={backgroundImage}
                    alt="Hero Background"
                    fill
                    priority
                    className="object-cover"
                />
                {/* Subtle dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content Container */}
            <div className="relative h-full flex items-end pb-24 px-6 md:px-16 lg:px-24">
                <div className="max-w-2xl">
                    <p className="text-white/80 text-sm tracking-[0.2em] uppercase mb-4">
                        {subheadline}
                    </p>
                    <h1 className="text-2xl sm:text-5xl md:text-6xl font-light text-white mb-8 leading-tight">

                        {headline.split('\n').map((line, i) => (
                            <span key={i} className="block">{line}</span>
                        ))}
                    </h1>
                    <Link
                        href={ctaLink}
                        className="inline-block border border-white text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
                    >
                        {ctaText}
                    </Link>
                </div>
            </div>
        </section>
    );
}