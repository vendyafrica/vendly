"use client"

import { useEffect, useMemo, useRef, useState } from "react"

const steps = [
    {
        num: "01",
        tab: "Post",
        title: "Post it.",
        body: "Add your Shopvendly link to your bio or drop it in the caption. Every product gets its own link. Share the dress. Share the skincare set. Share anything.",
        media: { type: "image", src: "/hero-5.jpg" }
    },
    {
        num: "02",
        tab: "Buy",
        title: "They click. They buy.",
        body: "Your buyer lands on a clean product page. No account. No password. Name, phone, address, Mobile Money. Under 90 seconds on any phone.",
        media: { type: "video", src: "https://cdn.cosmos.so/08020ebf-2819-4bb1-ab66-ae3642a73697.mp4" }
    },
    {
        num: "03",
        tab: "Ping",
        title: "You get the ping.",
        body: "The moment an order lands, your WhatsApp gets everything — buyer name, number, address, and what they ordered. No inbox-checking. No missed messages.",
        media: { type: "image", src: "/hero-2.jpg" }
    },
    {
        num: "04",
        tab: "Credit",
        title: "Creators get credit.",
        body: "Give any creator a link with their tag. Every sale they drive shows up in your dashboard — automatically tracked, commission calculated. They earn. You scale.",
        media: { type: "image", src: "/hero-3.jpg" }
    }
]

export function Features() {
    const tabs = useMemo(() => steps.map((s) => s.tab), [])
    const [activeIndex, setActiveIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const lastManualSwitchRef = useRef<number>(0)

    useEffect(() => {
        if (isPaused) return
        const id = window.setInterval(() => {
            const now = Date.now()
            if (now - lastManualSwitchRef.current < 7000) return
            setActiveIndex((i) => (i + 1) % steps.length)
        }, 4500)
        return () => window.clearInterval(id)
    }, [isPaused])

    const step = steps[activeIndex]!

    return (
        <section id="product" className="bg-[#F8F7F4] text-[#0A0A0F] pt-12 md:pt-18 pb-24 md:pb-32">
            <div className="mx-auto max-w-6xl px-6 md:px-8">

                {/* Header */}
                <div className="mb-14 md:mb-16">
                    <div className="text-[11px] font-semibold tracking-[2px] uppercase text-[#7B6EFF] mb-5">
                        How it works
                    </div>
                    <h2
                        className="text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.06] text-[#0A0A0F]"
                        style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', letterSpacing: '-1.5px' }}
                    >
                        From post to paid.<br />
                        <span className="text-[#3D3D4E]">In four steps.</span>
                    </h2>
                    <p className="mt-5 text-[16px] text-[#3D3D4E] max-w-3xl leading-relaxed">
                        No DMs. No back-and-forth. No dropped orders. Your content does
                        the selling — Shopvendly handles everything that comes after.
                    </p>
                </div>

                <div
                    className="relative overflow-hidden rounded-[28px] md:rounded-[36px] min-h-[520px] md:min-h-[620px] isolate border border-white/10 bg-white/5"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Background media */}
                    {step.media.type === "image" ? (
                        <img
                            key={step.media.src}
                            src={step.media.src}
                            alt={step.title}
                            className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
                            loading="lazy"
                        />
                    ) : (
                        <video
                            key={step.media.src}
                            className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
                            src={step.media.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/15" />

                    <div className="relative h-full px-6 md:px-10 py-12 md:py-14 flex flex-col">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            {tabs.map((tab, i) => {
                                const isActive = i === activeIndex
                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => {
                                            lastManualSwitchRef.current = Date.now()
                                            setActiveIndex(i)
                                        }}
                                        className={
                                            isActive
                                                ? "px-4 py-2 rounded-full bg-white text-[#0A0A0F] text-[11px] font-bold tracking-widest uppercase"
                                                : "px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-[11px] font-bold tracking-widest uppercase transition-colors"
                                        }
                                    >
                                        {tab}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="flex-1 flex items-center">
                            <div className="max-w-2xl">
                                <div
                                    className="text-[11px] font-bold tracking-widest text-[#BDB3FF] mb-4"
                                    style={{ fontFamily: 'var(--font-sora), Sora, sans-serif' }}
                                >
                                    {step.num}
                                </div>
                                <div
                                    className="text-[clamp(28px,4vw,44px)] font-extrabold text-white leading-[1.05]"
                                    style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', letterSpacing: '-1px' }}
                                >
                                    {step.title}
                                </div>
                                <p className="mt-5 text-[15px] md:text-[16px] text-white/85 leading-relaxed max-w-xl">
                                    {step.body}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center">
                            <div className="flex items-center gap-2">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={
                                            i === activeIndex
                                                ? "h-1.5 w-6 rounded-full bg-white"
                                                : "h-1.5 w-6 rounded-full bg-white/25"
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}