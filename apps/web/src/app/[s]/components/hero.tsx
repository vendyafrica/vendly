import Image from "next/image";
import { DeferredHeroVideo } from "./deferred-hero-video";

interface HeroProps {
    store: {
        name: string;
        description: string | null;
        heroMedia?: string[];
    };
}

const FALLBACK_HERO_IMAGE = "https://cdn.cosmos.so/23dcbd2e-147b-4387-8c4e-aa2bbcf22704?format=jpeg";

export function Hero({ store }: HeroProps) {
    const heroMedia = Array.isArray(store.heroMedia) ? store.heroMedia : [];
    const mediaUrl = heroMedia[0] || FALLBACK_HERO_IMAGE;
    const isVideo = typeof mediaUrl === "string" && !!mediaUrl.match(/\.(mp4|webm|ogg)$/i);
    const posterUrl = FALLBACK_HERO_IMAGE;

    const isBlobUrl = typeof mediaUrl === "string" && mediaUrl.includes("blob.vercel-storage.com");

    return (
        <section className="relative h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] w-full overflow-hidden mb-8 sm:mb-12">
            <div className="relative h-full w-full overflow-hidden rounded-none sm:rounded-b-3xl md:rounded-b-[40px]">
                {/* Media - Video or Image */}
                {isVideo ? (
                    <>
                        <Image
                            src={posterUrl}
                            alt={`${store.name} hero`}
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                        />
                        <DeferredHeroVideo
                            src={mediaUrl}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </>
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