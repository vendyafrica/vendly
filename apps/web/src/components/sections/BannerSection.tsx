'use client'

import Link from 'next/link'

interface BannerSectionProps {
    text?: string
    backgroundColor?: 'primary' | 'accent' | 'muted'
    ctaText?: string
    ctaLink?: string
}

export default function BannerSection({
    text,
    backgroundColor = 'primary',
    ctaText,
    ctaLink,
}: BannerSectionProps) {
    const bgColorClass = {
        primary: 'bg-[var(--primary)] text-white',
        accent: 'bg-[var(--accent)] text-white',
        muted: 'bg-[var(--muted)] text-[var(--foreground)]',
    }[backgroundColor]

    return (
        <section className={`py-12 px-6 ${bgColorClass}`}>
            <div className="content-container flex flex-col md:flex-row items-center justify-between gap-6">
                {text && (
                    <p className="text-lg md:text-xl font-semibold">{text}</p>
                )}
                {ctaText && ctaLink && (
                    <Link
                        href={ctaLink}
                        className="px-8 py-3 bg-white text-black rounded-sm font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
                    >
                        {ctaText}
                    </Link>
                )}
            </div>
        </section>
    )
}
