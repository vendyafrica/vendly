import { Button } from '@vendly/ui/components/button';
import Image from "next/image";

export function FeaturedSection() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Women's Section */}
            <div className="relative h-[500px] rounded-3xl overflow-hidden group">
                <Image
                    src="/images/woman-fashion.png"
                    alt="Women's Collection"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <h3 className="text-4xl font-light text-white mb-6 tracking-wide">Classic Elegance</h3>
                    <Button className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-base tracking-widest uppercase">
                        Shop Women
                    </Button>
                </div>
            </div>

            {/* Men's Section */}
            <div className="relative h-[500px] rounded-3xl overflow-hidden group">
                <Image
                    src="/images/man-fashion.png"
                    alt="Men's Collection"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <h3 className="text-4xl font-light text-white mb-6 tracking-wide">Refined Gentleman</h3>
                    <Button className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-base tracking-widest uppercase">
                        Shop Men
                    </Button>
                </div>
            </div>
        </section>
    );
}