"use client"

import { motion } from 'framer-motion'

const curators = [
    {
        name: "Amina's Boutique",
        category: "High Fashion",
        image: "/images/african_fashion.png",
        className: "md:col-span-2 md:row-span-2 min-h-[500px]"
    },
    {
        name: "Kofi Organics",
        category: "Skincare",
        image: "/images/african_beauty.png",
        className: "md:col-span-1 md:row-span-1 min-h-[300px]"
    },
    {
        name: "Nairobi Tech",
        category: "Electronics",
        image: "/images/african_entrepreneur.png",
        className: "md:col-span-1 md:row-span-1 min-h-[300px]"
    },
    {
        name: "Lagos Streetwear",
        category: "Apparel",
        image: "https://cdn.cosmos.so/5d252bfc-ff2d-421b-8e3b-fe7d9874d5b5?format=jpeg",
        className: "md:col-span-3 md:row-span-1 min-h-[400px]"
    }
]

export function Features() {
    return (
        <section className="bg-background pb-32 pt-16 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <h2 className="text-[12vw] md:text-[8rem] font-black tracking-tighter text-foreground leading-[0.85] uppercase max-w-2xl">
                        Curated<br />
                        <span className="text-foreground/30">Storefronts.</span>
                    </h2>
                    <p className="text-xl md:text-2xl font-mono text-muted-foreground font-bold max-w-md lowercase pb-2">
                        Discover the best independent brands across Africa, handpicked for you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(300px,auto)]">
                    {curators.map((curator, i) => (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
                            key={curator.name}
                            className={`group relative overflow-hidden rounded-4xl bg-black/5 ${curator.className}`}
                        >
                            <img
                                src={curator.image}
                                alt={curator.name}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

                            <div className="absolute bottom-0 left-0 p-8 flex flex-col gap-3">
                                <span className="text-primary font-mono text-[10px] font-bold tracking-widest uppercase py-1.5 px-3 bg-black/80 backdrop-blur-md rounded-full w-fit">
                                    {curator.category}
                                </span>
                                <h3 className="text-white text-3xl md:text-4xl font-black tracking-tighter uppercase">
                                    {curator.name}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}