'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '../../../sanity/lib/image'

interface HeroSectionProps {
    title?: string
    subtitle?: string
    backgroundImage?: any
    ctaText?: string
    ctaLink?: string
    layout?: 'centered' | 'split' | 'fullwidth'
}

export default function HeroSection({
    title,
    subtitle,
    backgroundImage,
    ctaText,
    ctaLink,
    layout = 'centered',
}: HeroSectionProps) {
    const imageUrl = backgroundImage ? urlFor(backgroundImage).width(1920).height(1080).url() : null

    if (layout === 'centered') {
        return (
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                {imageUrl && (
                    <div className="absolute inset-0">
                        <Image
                            src={imageUrl}
                            alt={title || 'Hero'}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/30" />
                    </div>
                )}
                <div className="relative z-10 text-center text-white px-6 max-w-3xl">
                    {title && (
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">{title}</h1>
                    )}
                    {subtitle && (
                        <p className="text-lg md:text-xl mb-8 opacity-90">{subtitle}</p>
                    )}
                    {ctaText && ctaLink && (
                        <Link
                            href={ctaLink}
                            className="inline-block bg-white text-black px-8 py-4 rounded-sm font-semibold hover:bg-gray-100 transition-colors"
                        >
                            {ctaText}
                        </Link>
                    )}
                </div>
            </section>
        )
    }

    if (layout === 'split') {
        return (
            <section className="grid md:grid-cols-2 min-h-[600px]">
                <div className="flex items-center justify-center p-12 bg-gray-50">
                    <div className="max-w-lg">
                        {title && (
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
                        )}
                        {subtitle && (
                            <p className="text-lg mb-8 text-gray-600">{subtitle}</p>
                        )}
                        {ctaText && ctaLink && (
                            <Link
                                href={ctaLink}
                                className="inline-block bg-black text-white px-8 py-4 rounded-sm font-semibold hover:bg-gray-800 transition-colors"
                            >
                                {ctaText}
                            </Link>
                        )}
                    </div>
                </div>
                {imageUrl && (
                    <div className="relative min-h-[400px] md:min-h-full">
                        <Image
                            src={imageUrl}
                            alt={title || 'Hero'}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}
            </section>
        )
    }

    // fullwidth layout
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {imageUrl && (
                <div className="absolute inset-0">
                    <Image
                        src={imageUrl}
                        alt={title || 'Hero'}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            )}
            <div className="relative z-10 text-center text-white px-6 max-w-4xl">
                {title && (
                    <h1 className="text-6xl md:text-7xl font-bold mb-8">{title}</h1>
                )}
                {subtitle && (
                    <p className="text-xl md:text-2xl mb-12 opacity-90">{subtitle}</p>
                )}
                {ctaText && ctaLink && (
                    <Link
                        href={ctaLink}
                        className="inline-block bg-white text-black px-12 py-5 rounded-sm font-semibold text-lg hover:bg-gray-100 transition-colors"
                    >
                        {ctaText}
                    </Link>
                )}
            </div>
        </section>
    )
}
