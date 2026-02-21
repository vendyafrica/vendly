"use client"

import Image from "next/image"
import { Anton } from "next/font/google"
import { useEffect, useRef, useState } from "react"
import { Highlighter } from "@/components/ui/highlighter"
import { TextAnimate } from "@/components/ui/text-animate"

const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap" })

export function TasteTransition() {
    const containerRef = useRef<HTMLElement | null>(null)
    const [hasEntered, setHasEntered] = useState(false)
    const [showHighlight, setShowHighlight] = useState(false)
    const [cycle, setCycle] = useState(0)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setHasEntered(true)
                    setShowHighlight(false)
                    setCycle((c) => c + 1)
                } else {
                    setHasEntered(false)
                    setShowHighlight(false)
                }
            },
            { threshold: 0.4 }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!hasEntered) return
        const t = window.setTimeout(() => setShowHighlight(true), 1600)
        return () => window.clearTimeout(t)
    }, [hasEntered])

    return (
        <section ref={containerRef} className="relative bg-[#F8F7F4] text-[#0A0A0F] py-14 md:py-20">
            <div className="mx-auto max-w-4xl px-5 md:px-8 text-center space-y-5 md:space-y-6">
                <div className="flex justify-center">
                    <Image src="/vendly.png" alt="Vendly" width={120} height={32} className="h-8 w-auto" />
                </div>
                <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#6C6C7A]">
                    Built for social sellers who want speed and control
                </div>
                {showHighlight ? (
                    <h2
                        key={`highlight-${cycle}`}
                        className={`${anton.className} text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.05] tracking-normal`}
                    >
                        <Highlighter action="underline" color="#5B4BFF" strokeWidth={2.4} animationDuration={1200} iterations={3} padding={2} isView>
                            Scale
                        </Highlighter>{" "}
                        every conversation into a confirmed{" "}
                        <Highlighter action="highlight" color="#D9D6FF" strokeWidth={1.6} animationDuration={1200} iterations={2} padding={3} isView>
                            order
                        </Highlighter>
                        .
                    </h2>
                ) : (
                    <TextAnimate
                        key={`text-${cycle}`}
                        animation="blurInUp"
                        by="word"
                        className={`text-[clamp(32px,5vw,52px)] ${anton.className} font-extrabold leading-[1.05] tracking-tight`}
                        segmentClassName="inline-block"
                        delay={0.15}
                        duration={1.4}
                        startOnView={false}
                        animate={hasEntered ? "show" : "hidden"}
                    >
                        Scale every conversation into a confirmed order.
                    </TextAnimate>
                )}
                <p className="text-[16px] md:text-[17px] text-[#3D3D4E] leading-relaxed max-w-2xl mx-auto">
                    Automate checkout, keep your margins, and stay in control of your customer list—without sending buyers to a marketplace that owns the relationship.
                </p>
            </div>
        </section>
    )
}
