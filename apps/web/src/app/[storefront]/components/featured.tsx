import Image from "next/image";
import Link from "next/link";
import { StoreFeaturedConfig } from "../../../types/store-config";
import { cn, themeClasses, animations } from "../../../lib/theme-utils";

interface FeaturedSectionProps {
    config: StoreFeaturedConfig;
}

export function FeaturedSection({ config }: FeaturedSectionProps) {
    const { items } = config;

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, index) => (
                <div key={index} className={cn(
                    "relative h-[500px] rounded-(--radius)] overflow-hidden group",
                    themeClasses.card,
                    animations.transition
                )}>
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                        <h3 className="text-4xl font-light text-white mb-6 tracking-wide">{item.title}</h3>
                        <Link
                            href={item.link}
                            className={cn(
                                "inline-block px-8 py-4 text-base tracking-widest uppercase rounded-full",
                                "bg-white text-black hover:bg-white/90",
                                animations.transition,
                                themeClasses.focus.ring
                            )}
                        >
                            {item.ctaText}
                        </Link>
                    </div>
                </div>
            ))}
        </section>
    );
}
