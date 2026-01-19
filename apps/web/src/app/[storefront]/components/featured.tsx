import { Button } from '@vendly/ui/components/button';
import Image from "next/image";
import { StoreFeaturedConfig } from "@vendly/ui/src/types/store-config";

interface FeaturedSectionProps {
    config: StoreFeaturedConfig;
}

export function FeaturedSection({ config }: FeaturedSectionProps) {
    const { items } = config;

    return (
        <section className={`grid grid-cols-1 md:grid-cols-${items.length} gap-4`}>
            {items.map((item, index) => (
                <div key={index} className="relative h-[500px] rounded-3xl overflow-hidden group">
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                        <h3 className="text-4xl font-light text-white mb-6 tracking-wide">{item.title}</h3>
                        <Button className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-base tracking-widest uppercase">
                            {item.ctaText}
                        </Button>
                    </div>
                </div>
            ))}
        </section>
    );
}
