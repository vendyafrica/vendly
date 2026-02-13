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
        return VIDEO_EXTENSIONS.some((ext) => parsed.pathname.toLowerCase().endsWith(ext));
    } catch {
        const cleanUrl = url.split("?")[0]?.split("#")[0] ?? url;
        return VIDEO_EXTENSIONS.some((ext) => cleanUrl.toLowerCase().endsWith(ext));
    }
}

export function Hero({ store }: HeroProps) {
    const heroMedia = Array.isArray(store.heroMedia) ? store.heroMedia : [];
    const mediaUrl = heroMedia[0] || FALLBACK_HERO_MEDIA;
    const isVideo = typeof mediaUrl === "string" && isVideoUrl(mediaUrl);

    const isBlobUrl = typeof mediaUrl === "string" && mediaUrl.includes("blob.vercel-storage.com");

    return (
        <section className="relative h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] w-full overflow-hidden mb-8 sm:mb-12">
            <div className="relative h-full w-full overflow-hidden rounded-none sm:rounded-b-3xl md:rounded-b-[40px]">
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
                        unoptimized={isBlobUrl}
                    />
                )}

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-black/0" />

                {/* Bottom overlay with store info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 lg:p-10">
                    <div className="flex items-end justify-between flex-wrap gap-4">
                        <div className="text-white">
                            {/* <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-2">
                                {store.name}
                            </h1> */}
                            {store.description && (
                                <p className="text-sm sm:text-base md:text-md text-white/90 max-w-lg">
                                    {store.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}