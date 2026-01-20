"use client";

import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

export function Hero() {
    return (
        <section className="relative h-[85vh] w-full overflow-hidden">
            <div className="relative h-full w-full overflow-hidden rounded-b-[60px] md:rounded-b-[100px]">
                
                <Image
                    src="/images/linen-shirt.png" 
                    alt="Hero Background"
                    fill
                    priority
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/10" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
                    <h1 className="text-7xl md:text-[12rem] font-serif leading-none tracking-tight">
                        Asird
                    </h1>
                </div>

                <div className="absolute bottom-10 left-6 md:left-12 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold">Asird</h2>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm font-medium">4.8</span>
                        <HugeiconsIcon icon={StarIcon} size={14} className="fill-white" />
                        <span className="text-xs opacity-80 ml-1">(275.1K)</span>
                    </div>
                </div>
            </div>
        </section>
    );
}