"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function TasteTransition() {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start']
    })

    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])
    const y = useTransform(scrollYProgress, [0, 0.5], [100, 0])

    return (
        <section ref={containerRef} className="relative min-h-screen bg-primary flex items-center justify-center overflow-hidden py-32">
            <motion.div
                style={{ scale, opacity, y }}
                className="text-center px-4"
            >
                <h2 className="text-[15vw] md:text-[18vw] font-black tracking-tighter text-primary-foreground leading-none uppercase">
                    Taste
                </h2>
                <p className="mt-4 text-xl md:text-3xl font-mono text-primary-foreground/70 font-bold max-w-3xl mx-auto lowercase">
                    built for african brands that elevate their aesthetic.
                </p>
            </motion.div>
        </section>
    )
}
