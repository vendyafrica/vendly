"use client"

import Image from "next/image";
import { DeferredHeroVideo } from "./deferred-hero-video";

interface HeroProps {
    store: {
        name: string;
        description: string | null;
        heroMedia?: string[];
    };
}

const FALLBACK_HERO_MEDIA = "https://cdn.cosmos.so/c1a24f82-42e5-43b4-a1c5-2da242f3ae3b.mp4";
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg"];

function isVideoUrl(url: string) {
    try {
        const parsed = new URL(url);
        const pathname = parsed.pathname.toLowerCase();

        // UploadThing (and similar) keeps the mime type in a query param.
        const typeParam = parsed.searchParams.get("x-ut-file-type") || parsed.searchParams.get("file-type");
        if (typeParam && typeParam.toLowerCase().startsWith("video")) return true;

        // Otherwise rely on the path extension.
        const hasVideoExt = VIDEO_EXTENSIONS.some((ext) => pathname.endsWith(ext));
        if (hasVideoExt) return true;

        // UploadThing direct file links (ufs.sh) often have no extension; treat unknown extensionless URLs as video to avoid Next/Image errors.
        const hasNoExtension = !pathname.includes(".");
        return hasNoExtension;
    } catch {
        const cleanUrl = url.split("?")[0]?.split("#")[0] ?? url;
        const lower = cleanUrl.toLowerCase();
        const hasVideoExt = VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
        if (hasVideoExt) return true;

        const hasNoExtension = !lower.includes(".");
        return hasNoExtension;
    }
}

export function Hero({ store }: HeroProps) {
    const heroMedia = Array.isArray(store.heroMedia) ? store.heroMedia : [];
    const mediaUrl = heroMedia[0] || FALLBACK_HERO_MEDIA;
    const isVideo = typeof mediaUrl === "string" && isVideoUrl(mediaUrl);

    if (typeof window !== "undefined") {
        console.info("[Hero] media selection", { mediaUrl, heroMediaCount: heroMedia.length, isVideo });
    }

    return (
        <section className="relative h-[75vh] min-h-[75vh] sm:h-screen sm:min-h-screen w-full overflow-hidden">
            <div className="relative h-full w-full overflow-hidden">
                {/* Media - Video or Image */}
                {isVideo ? (
                    <DeferredHeroVideo
                        src={mediaUrl}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <Image
                        src={mediaUrl}
                        alt={`${store.name} hero`}
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                )}

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Bottom overlay with store info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-14 lg:p-20">
                    <div className="flex items-end justify-between flex-wrap gap-6">
                        <div className="text-white max-w-2xl">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight mb-4">
                                {store.name}
                            </h1>
                            {store.description && (
                                <p className="text-base sm:text-lg text-white/90 mb-8 max-w-xl font-light leading-relaxed">
                                    {store.description}
                                </p>
                            )}
                            <button
                                onClick={() => {
                                    window.scrollTo({
                                        top: window.innerHeight,
                                        behavior: 'smooth'
                                    });
                                }}
                                className="px-8 py-3 bg-white text-black text-sm font-medium tracking-widest uppercase hover:bg-white/90 transition-colors"
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}