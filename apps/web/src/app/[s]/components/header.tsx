"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag02Icon, UserIcon, StarIcon } from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";
import { HeaderSkeleton } from "./skeletons";
import { useCart } from "../../../contexts/cart-context";

interface StoreData {
    name: string;
    slug: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

interface HeaderIconButtonProps {
    icon: any;
    href?: string;
    className?: string;
    showBadge?: boolean;
    badgeCount?: number;
    isHomePage: boolean;
}

function HeaderIconButton({ icon, href, className, showBadge, badgeCount, isHomePage }: HeaderIconButtonProps) {
    const iconClass = isHomePage
        ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
        : "text-neutral-900";

    const buttonSurfaceClass = isHomePage
        ? "bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 hover:border-white/25"
        : "bg-neutral-100 border border-neutral-200 hover:bg-neutral-200 hover:border-neutral-300";

    const content = (
        <Button
            variant="ghost"
            size="icon"
            className={`
                relative rounded-full
                min-h-[44px] min-w-[44px]
                p-2 sm:p-2.5
                cursor-pointer
                transition-all
                ${buttonSurfaceClass}
                focus-visible:outline-none
                focus-visible:ring-[3px]
                focus-visible:ring-primary/20
                ${className}
            `}
        >
            <HugeiconsIcon icon={icon} size={22} className={iconClass} />
            {showBadge && badgeCount !== undefined && badgeCount > 0 && (
                <span className="
                    pointer-events-none
                    absolute -top-1 -right-1
                    flex h-4 w-4 items-center justify-center
                    rounded-full
                    bg-black/85
                    text-[10px] font-medium text-white
                    ring-2 ring-white/60
                ">
                    {badgeCount}
                </span>
            )}
        </Button>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}

export function StorefrontHeader() {
    const params = useParams();
    const pathname = usePathname();
    const { itemCount } = useCart();
    const [store, setStore] = useState<StoreData | null>(null);

    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchStore = async () => {
            const slug = params?.s as string;
            if (!slug) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/api/storefront/${slug}`);
                if (res.ok) {
                    setStore(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch store data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, [params?.s]);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY < 80);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loading) return <HeaderSkeleton />;
    if (!store) return null;

    const isHomePage = pathname === `/${params?.s}`;
    const textColorClass = isHomePage
        ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] hover:text-white/90"
        : "text-neutral-900 hover:text-neutral-600";

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"} ${!isHomePage ? "bg-white border-b border-neutral-100" : ""}`}
        >
            {isHomePage && (
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/35 via-black/15 to-transparent" />
            )}

            <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10">
                <div className="flex items-center justify-between h-16 sm:h-[70px] md:h-20 gap-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/${store.slug}`}
                            className={`${textColorClass} font-serif text-xl sm:text-2xl tracking-tight transition-colors`}
                        >
                            {store.name}
                        </Link>
                    </div>
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <HeaderIconButton
                            icon={ShoppingBag02Icon}
                            href="/cart"
                            showBadge
                            badgeCount={itemCount}
                            isHomePage={isHomePage}
                        />
                        <HeaderIconButton
                            icon={StarIcon}
                            isHomePage={isHomePage}
                        />
                        <HeaderIconButton
                            icon={UserIcon}
                            href={`/login?store=${encodeURIComponent(store.name)}&slug=${encodeURIComponent(store.slug)}`}
                            isHomePage={isHomePage}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}