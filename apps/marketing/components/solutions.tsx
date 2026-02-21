"use client"

import { useState } from 'react'
import Link from 'next/link'

const tabs = ['For Stores', 'For Creators'] as const
type Tab = typeof tabs[number]

const mediaByTab: Record<Tab, { type: 'image' | 'video'; src: string }> = {
    'For Stores': { type: 'image', src: '/hero-6.jpg' },
    'For Creators': { type: 'image', src: '/hero-8.jpg' },
}

const content: Record<Tab, {
    eyebrow: string
    title: string
    body: string
    list: string[]
    proof: string
    cta: string
    ctaHref: string
}> = {
    'For Stores': {
        eyebrow: 'For Stores',
        title: 'Put an Engine\n behind your store.',
        body: "Drop one link in bio and sell right where the conversation starts. Shoppable posts, instant checkout, automated receipts, and every buyer saved for follow-up — without babysitting your inbox.",
        list: [
            'Launch a storefront from Instagram in minutes',
            'Fast checkout with saved buyer details',
            'Order pings on WhatsApp — no dashboard babysitting',
            'See which posts actually drive revenue',
        ],
        proof: "Stop leaking orders in DMs. Turn chats into tracked, paid checkouts.",
        cta: "Create your store — it's free →",
        ctaHref: 'https://duuka.store/onboarding',
    },
    'For Creators': {
        eyebrow: 'For Creators',
        title: 'Convert engagement,\n into big results.',
        body: "Get paid for the community you build around your personal brand.",
        list: [
            'One link per product — drop it in bio, caption, or DMs',
            'Commission tracked automatically on every completed sale',
            'No chasing sellers, no spreadsheets, no awkward follow-ups',
            'See your earnings in real time from any device',
            'Works on Instagram, TikTok, and WhatsApp',
        ],
        proof: "Your content has been making sellers money for free. It's time that changed.",
        cta: 'Get your creator link →',
        ctaHref: 'https://duuka.store/onboarding',
    },
}


export function Solutions() {
    const [active, setActive] = useState<Tab>('For Stores')
    const media = mediaByTab[active]

    return (
        <section id="solutions" className="bg-[#F8F7F4] py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6 md:px-8">

                {/* Header */}
                <div className="mb-10 md:mb-12">
                    <div className="text-[11px] font-semibold tracking-[2px] uppercase text-[#7B6EFF] mb-5">Solutions</div>
                    <h2
                        className="text-[clamp(30px,4.5vw,50px)] font-extrabold text-[#0A0A0F] leading-[1.08]"
                        style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', letterSpacing: '-1.5px' }}
                    >
                        Built for how you<br />already sell.
                    </h2>
                </div>

                <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] min-h-[540px] md:min-h-[600px] isolate border border-white/10 bg-white/5">
                    {/* Background media */}
                    {media.type === 'image' ? (
                        <img
                            key={media.src}
                            src={media.src}
                            alt={active}
                            className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
                            loading="lazy"
                        />
                    ) : (
                        <video
                            key={media.src}
                            className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
                            src={media.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-black/15" />

                    <div className="relative h-full px-6 md:px-10 py-12 md:py-14 flex flex-col gap-8">
                        {/* Tabs */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActive(tab)}
                                    className={
                                        active === tab
                                            ? "px-5 py-2.5 rounded-full bg-white text-[#0A0A0F] text-[12px] font-bold tracking-widest uppercase"
                                            : "px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-[12px] font-bold tracking-widest uppercase transition-colors"
                                    }
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 flex items-center">
                            <div className="max-w-2xl">
                                <div className="text-[11px] font-semibold tracking-[1.5px] uppercase text-[#BDB3FF] mb-4">
                                    {content[active].eyebrow}
                                </div>
                                <h3
                                    className="text-[clamp(30px,4vw,46px)] font-extrabold text-white leading-[1.08] mb-4"
                                    style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', letterSpacing: '-1px' }}
                                >
                                    {content[active].title.split('\n').map((line, i) => (
                                        <span key={i}>{line}{i === 0 && <br />}</span>
                                    ))}
                                </h3>
                                <p className="text-[15px] md:text-[16px] text-white/85 leading-relaxed mb-6 max-w-xl">
                                    {content[active].body}
                                </p>
                                <ul className="flex flex-col gap-3 mb-7">
                                    {content[active].list.map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-[14px] text-white/85 leading-snug">
                                            <span className="w-5 h-5 rounded-full bg-white/15 border border-white/25 shrink-0 mt-0.5 flex items-center justify-center">
                                                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                                    <path d="M1 3.5L3 5.5L8 1" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-l-2 border-white/60 pl-4 mb-7 text-[14px] text-white/85 italic leading-relaxed bg-white/5 py-3 pr-4 rounded-r-xl">
                                    {content[active].proof}
                                </div>
                                <Link
                                    href={content[active].ctaHref}
                                    className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#0A0A0F] bg-white hover:bg-white/90 rounded-full px-7 py-4 transition-all duration-200 shadow-lg shadow-black/15 hover:-translate-y-0.5"
                                >
                                    {content[active].cta}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
