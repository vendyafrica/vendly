"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "./product-grid";

export function ProductGridReveal() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 80);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className={`transition-all duration-500 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-10 md:py-14">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">More looks</h2>
                </div>
                <ProductGrid />
            </div>
        </section>
    );
}
