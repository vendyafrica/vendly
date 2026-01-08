import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface FashionHeroProps {
    label?: string;
    title: string;
    ctaText: string;
    ctaLink: string;
    ctaPadding?: string;
    imageUrl: string;
    overlayColor?: string;
}

export function FashionHero({
    label,
    title,
    ctaText,
    ctaLink,
    ctaPadding = "16px 32px",
    imageUrl,
    overlayColor = "rgba(0, 0, 0, 0.4)",
}: FashionHeroProps) {
    return (
        <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
            {/* Background Image */}
            {imageUrl ? (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
            )}

            {/* Overlay */}
            <div
                className="absolute inset-0"
                style={{ backgroundColor: overlayColor }}
            />

            {/* Content */}
            <div className="relative container mx-auto px-4 lg:px-8">
                <div className="max-w-lg">
                    {/* Category Label */}
                    {label && (
                        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4 text-white/80">
                            {label}
                        </span>
                    )}

                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-white font-serif">
                        {title}
                    </h1>

                    {/* CTA Button */}
                    <Link
                        href={ctaLink}
                        className="inline-flex items-center gap-3 bg-black text-white font-medium transition-all hover:bg-gray-900 text-sm tracking-wide"
                        style={{ padding: ctaPadding }}
                    >
                        {ctaText}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Decorative circle on left */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-white/30 hidden lg:block" />
        </section>
    );
}

export default FashionHero;
