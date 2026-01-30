import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

interface HeroProps {
    store: {
        name: string;
        description: string | null;
        rating: number;
        ratingCount: number;
        heroMedia?: string | null;
        heroMediaType?: "image" | "video" | null | string;
    };
}

export function Hero({ store }: HeroProps) {
    const formatRatingCount = (count: number) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    const mediaUrl = store.heroMedia || "/images/linen-shirt.png";
    // Basic check for video type or extension
    const isVideo = store.heroMediaType === "video" || mediaUrl.match(/\.(mp4|webm|ogg)$/i);

    return (
        <section className="relative h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] w-full overflow-hidden mb-8 sm:mb-12">
            <div className="relative h-full w-full overflow-hidden rounded-none sm:rounded-b-3xl md:rounded-b-[40px]">
                {/* Media - Video or Image */}
                {isVideo ? (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={mediaUrl} type="video/mp4" />
                    </video>
                ) : (
                    <Image
                        src={mediaUrl}
                        alt={`${store.name} hero`}
                        fill
                        priority
                        className="object-cover"
                    />
                )}

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-black/0" />

                {/* Bottom overlay with store info */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 lg:p-10">
                    <div className="flex items-end justify-between flex-wrap gap-4">
                        <div className="text-white">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mb-2">
                                {store.name}
                            </h1>
                            {store.description && (
                                <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-lg">
                                    {store.description}
                                </p>
                            )}
                        </div>

                        {/* Rating badge */}
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                            <HugeiconsIcon icon={StarIcon} size={18} className="fill-white" />
                            <span className="text-sm sm:text-base font-medium text-white">
                                {store.rating.toFixed(1)}
                            </span>
                            <span className="text-xs sm:text-sm text-white/80">
                                ({formatRatingCount(store.ratingCount)})
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}