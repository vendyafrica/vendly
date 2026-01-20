"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag02Icon, UserIcon, StarIcon } from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";

export function StorefrontHeader() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY < 80);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (pathname?.includes("/products/")) return null;

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between h-24">
                    
                    <Link href="/" className="text-white font-serif text-2xl tracking-tight">
                        Asird
                    </Link>

                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="icon" className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-white/20 transition-all">
                            <HugeiconsIcon icon={UserIcon} size={20} />
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-white/20 transition-all">
                            <HugeiconsIcon icon={ShoppingBag02Icon} size={20} />
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-white/20 transition-all">
                            <HugeiconsIcon icon={StarIcon} size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}