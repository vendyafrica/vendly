"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function TasteTransition() {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    })

    const scale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1])
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
    const y = useTransform(scrollYProgress, [0, 0.5], [100, 0])

    const problems = [
        "Link-in-bio tools are dead ends without commerce.",
        "Traditional storefronts kill your conversions.",
        "Marketplaces steal your audience & margins."
    ]

    return (
        <section ref={containerRef} className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden py-32">
            <motion.div
                style={{ scale, opacity, y }}
                className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center"
            >
                <div className="text-center w-full mb-16 md:mb-24">
                    <h2 className="text-[14vw] md:text-[9vw] font-black tracking-tighter text-foreground leading-[0.85] uppercase">
                        The System <br />
                        <span className="text-foreground/30">is broken.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 w-full max-w-5xl mx-auto">
                    {problems.map((problem, i) => (
                        <div key={i} className="flex flex-col gap-5 text-left">
                            <div className="h-[2px] w-full bg-foreground/20" />
                            <span className="text-foreground/30 font-mono font-bold text-sm">
                                0{i + 1}
                            </span>
                            <p className="text-xl md:text-2xl font-mono text-foreground/80 font-bold lowercase">
                                {problem}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 md:mt-32 text-center">
                    <p className="text-lg md:text-2xl font-mono text-foreground/60 max-w-3xl mx-auto lowercase">
                        creators shouldn't have to duct-tape five different tools together just to sell a product.
                        it's time for a platform that actually works for you.
                    </p>
                </div>
            </motion.div>
        </section>
    )
}
