"use client"

import { useState } from 'react'
import Link from 'next/link'

const tabs = ['For Stores', 'For Creators'] as const
type Tab = typeof tabs[number]

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
        title: 'Stop selling\nfrom your inbox.',
        body: "Your DMs are not an order management system. They're a waiting room where buyers lose patience and leave. Shopvendly gives you a real storefront — built from your social content — with checkout, payment, and order tracking built in.",
        list: [
            'Storefront live in under 3 minutes from your Instagram',
            'Fixed prices, clean checkout, no DM coordination',
            'WhatsApp order notifications — no dashboard required',
            'See which posts and creators drive your actual revenue',
            "Every buyer's contact saved automatically for repeat sales",
        ],
        proof: "Sellers on Shopvendly stop losing orders they didn't know they were losing.",
        cta: "Create your store — it's free →",
        ctaHref: 'https://duuka.store/onboarding',
    },
    'For Creators': {
        eyebrow: 'For Creators',
        title: 'You drive the sale.\nYou should get paid for it.',
        body: "You post. Your audience trusts you. They want what you're wearing, using, eating. But there's nowhere to send them — so the moment passes and nobody gets paid. Shopvendly gives you a trackable link for every product you feature.",
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

function StoreDashboard() {
    return (
        <div className="bg-[#F5F5F7] border border-[#EBEBF0] rounded-2xl p-6 md:p-8 flex flex-col gap-4 min-h-[380px]">
            <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#8A8A9E] mb-2">Seller Dashboard</div>
            {/* Stats */}
            <div className="bg-white border border-[#EBEBF0] rounded-xl px-5 py-4 flex items-center justify-between">
                <span className="text-[13px] text-[#8A8A9E]">Revenue this week</span>
                <div className="flex items-center gap-2">
                    <span className="text-[18px] font-extrabold text-[#0A0A0F]" style={{ fontFamily: 'var(--font-sora), Sora, sans-serif' }}>UGX 2.4M</span>
                    <span className="text-[11px] font-semibold text-emerald-500">↑ 34%</span>
                </div>
            </div>
            <div className="bg-white border border-[#EBEBF0] rounded-xl px-5 py-4 flex items-center justify-between">
                <span className="text-[13px] text-[#8A8A9E]">Orders today</span>
                <div className="flex items-center gap-2">
                    <span className="text-[18px] font-extrabold text-[#0A0A0F]" style={{ fontFamily: 'var(--font-sora), Sora, sans-serif' }}>12</span>
                    <span className="text-[11px] font-semibold text-emerald-500">↑ 8</span>
                </div>
            </div>
            {/* Order card */}
            <div className="bg-white border border-[#EBEBF0] rounded-xl px-5 py-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-semibold text-[#0A0A0F]">Rust Linen Midi Dress</span>
                    <span className="text-[11px] text-[#8A8A9E]">2 min ago</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#3D3D4E]">Sarah K. · Kampala</span>
                    <span className="text-[12px] font-semibold text-[#5B4BFF]">UGX 95,000</span>
                </div>
                <div className="mt-2 inline-block bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-full px-2.5 py-1">
                    ✓ Payment confirmed
                </div>
            </div>
        </div>
    )
}

function CreatorDashboard() {
    const items = [
        { name: 'Rust Linen Dress · Amara Store', commission: 'UGX 9,500', sales: '14 sales · 10% commission', pct: 70 },
        { name: 'Glow Serum · Skin by Zara', commission: 'UGX 28,000', sales: '8 sales · 15% commission', pct: 45 },
        { name: 'Beaded Earrings · Nala Crafts', commission: 'UGX 12,000', sales: '6 sales · 20% commission', pct: 30 },
    ]
    return (
        <div className="bg-[#F5F5F7] border border-[#EBEBF0] rounded-2xl p-6 md:p-8 flex flex-col gap-4 min-h-[380px]">
            <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#8A8A9E] mb-2">Creator Earnings</div>
            <div className="bg-white border border-[#EBEBF0] rounded-xl px-5 py-4 flex items-center justify-between">
                <span className="text-[13px] text-[#8A8A9E]">Earned this month</span>
                <div className="flex items-center gap-2">
                    <span className="text-[18px] font-extrabold text-[#0A0A0F]" style={{ fontFamily: 'var(--font-sora), Sora, sans-serif' }}>UGX 420K</span>
                    <span className="text-[11px] font-semibold text-emerald-500">↑ 62%</span>
                </div>
            </div>
            {items.map((item) => (
                <div key={item.name} className="bg-white border border-[#EBEBF0] rounded-xl px-5 py-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-semibold text-[#0A0A0F] truncate mr-2">{item.name}</span>
                        <span className="text-[12px] font-bold text-[#5B4BFF] shrink-0">{item.commission}</span>
                    </div>
                    <div className="text-[11px] text-[#8A8A9E] mb-2">{item.sales}</div>
                    <div className="h-1 bg-[#F0EEFF] rounded-full overflow-hidden">
                        <div className="h-full bg-[#5B4BFF] rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function Solutions() {
    const [active, setActive] = useState<Tab>('For Stores')

    return (
        <section id="solutions" className="bg-white py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6 md:px-8">

                {/* Header */}
                <div className="mb-12">
                    <div className="text-[11px] font-semibold tracking-[2px] uppercase text-[#5B4BFF] mb-5">Solutions</div>
                    <h2
                        className="text-[clamp(30px,4.5vw,50px)] font-extrabold text-[#0A0A0F] leading-[1.08]"
                        style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', letterSpacing: '-1.5px' }}
                    >
                        Built for how you<br />already sell.
                    </h2>
                </div>

                {/* Tabs */}
                <div className="flex bg-[#F5F5F7] border border-[#EBEBF0] rounded-full w-fit p-1 mb-14 gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActive(tab)}
                            className={`text-[13px] font-medium rounded-full px-6 py-2.5 transition-all duration-200 cursor-pointer ${active === tab
                                    ? 'bg-white text-[#0A0A0F] font-semibold shadow-sm'
                                    : 'text-[#8A8A9E] hover:text-[#3D3D4E]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-start">
                        {/* Text */}
                        <div>
                            <div className="text-[11px] font-semibold tracking-[1.5px] uppercase text-[#5B4BFF] mb-4">
                                {content[active].eyebrow}
                            </div>
                            <h3
                                className="text-[clamp(26px,3.5vw,38px)] font-extrabold text-[#0A0A0F] leading-[1.12] mb-5"
                                style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', letterSpacing: '-1px' }}
                            >
                                {content[active].title.split('\n').map((line, i) => (
                                    <span key={i}>{line}{i === 0 && <br />}</span>
                                ))}
                            </h3>
                            <p className="text-[15px] text-[#3D3D4E] leading-relaxed mb-7">
                                {content[active].body}
                            </p>
                            <ul className="flex flex-col gap-3 mb-8">
                                {content[active].list.map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-[14px] text-[#3D3D4E] leading-snug">
                                        <span className="w-5 h-5 rounded-full bg-[#F0EEFF] shrink-0 mt-0.5 flex items-center justify-center">
                                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                                <path d="M1 3.5L3 5.5L8 1" stroke="#5B4BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            {/* Proof */}
                            <div className="border-l-2 border-[#5B4BFF] pl-4 mb-8 text-[14px] text-[#3D3D4E] italic leading-relaxed bg-[#F0EEFF] py-3 pr-4 rounded-r-xl">
                                {content[active].proof}
                            </div>
                            <Link
                                href={content[active].ctaHref}
                                className="inline-flex items-center gap-2 text-[15px] font-semibold text-white bg-[#5B4BFF] hover:bg-[#7B6EFF] rounded-full px-7 py-4 transition-all duration-200 shadow-lg shadow-[#5B4BFF]/25 hover:-translate-y-0.5"
                            >
                                {content[active].cta}
                            </Link>
                        </div>

                        {/* Visual */}
                        {active === 'For Stores' ? <StoreDashboard /> : <CreatorDashboard />}
                </div>
            </div>
        </section>
    )
}
