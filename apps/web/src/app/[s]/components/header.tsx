"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";

import { ShoppingBag02Icon, UserIcon, FavouriteIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HeaderSkeleton } from "./skeletons";
import { useCart } from "@/contexts/cart-context";
import { StorefrontSearch } from "./storefront-search";

interface StoreData {
    name: string;
    slug: string;
    logoUrl?: string;
}

export function StorefrontHeader() {

    const params = useParams();
    const pathname = usePathname();
    const { itemCount } = useCart();
    const [store, setStore] = useState<StoreData | null>(null);

    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement | null>(null);
    const lastScrollYRef = useRef(0);

    useEffect(() => {
        const fetchStore = async () => {
            const slug = params?.s as string;
            if (!slug) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/storefront/${slug}`);
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
        lastScrollYRef.current = window.scrollY;

        const handleScroll = () => {
            const currentY = window.scrollY;
            const isScrollingDown = currentY > lastScrollYRef.current;
            lastScrollYRef.current = currentY;

            // Always show when you're basically at the top.
            if (currentY < 80) {
                setIsVisible(true);
                return;
            }

            // Hide while scrolling down.
            if (isScrollingDown) {
                setIsVisible(false);
                return;
            }

            // Scrolling up: only show again when near the categories rail.
            const rail = document.getElementById("storefront-categories-rail");
            if (!rail) return;

            const railTop = rail.getBoundingClientRect().top;
            const headerRevealThreshold = 140;
            if (railTop <= headerRevealThreshold) {
                setIsVisible(true);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!isSearchOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsSearchOpen(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isSearchOpen]);

    if (loading) return <HeaderSkeleton />;
    if (!store) return null;

    const isHomePage = pathname === `/${params?.s}`;
    const textColorClass = isHomePage ? "text-white hover:text-white/90" : "text-foreground hover:text-foreground/80";

    const barClass = isHomePage
        ? "bg-transparent"
        : "bg-background border-b border-border";

    const iconColor = isHomePage ? "text-white" : "text-foreground";

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
        >
            <div className={`relative ${barClass}`}>
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10">
                    <div className="flex items-center gap-4 sm:gap-6 md:gap-8 h-16 sm:h-[70px] md:h-20">
                        {/* Left: Store name */}
                        <div className="min-w-[120px] sm:min-w-[160px] flex items-center gap-3">
                            <Link
                                href={`/${store.slug}`}
                                className={`${textColorClass} font-semibold text-xl sm:text-2xl tracking-tight transition-colors`}
                            >
                                {store.name}
                            </Link>
                        </div>

                        <div className="flex-1 flex items-center justify-end sm:justify-start">
                            <div
                                ref={searchContainerRef}
                                className={`hidden sm:block overflow-hidden transition-all duration-200 ease-out ${isSearchOpen ? "max-w-[520px] opacity-100" : "max-w-0 opacity-0"}`}
                            >
                                <div className="w-[min(520px,70vw)] pr-2">
                                    <StorefrontSearch
                                        storeSlug={store.slug}
                                        isHomePage={isHomePage}
                                        onSubmitted={() => setIsSearchOpen(false)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right: Icons */}
                        <div className="flex items-center gap-1 sm:gap-1">
                            <button
                                onClick={() => setIsSearchOpen((v) => !v)}
                                className={`inline-flex h-10 w-10 items-center cursor-pointer justify-center transition-colors ${isHomePage ? "hover:opacity-80" : "hover:bg-muted/70 rounded-full"}`}
                                aria-label="Search"
                            >
                                <HugeiconsIcon icon={Search01Icon} size={18} className={iconColor} />
                            </button>

                            <Link
                                href="/cart"
                                className={`relative inline-flex h-10 w-10 items-center cursor-pointer justify-center transition-colors ${isHomePage ? "hover:opacity-80" : "hover:bg-muted/70 rounded-full"}`}
                                aria-label="Cart"
                            >
                                <HugeiconsIcon icon={ShoppingBag02Icon} size={18} className={iconColor} />
                                {itemCount > 0 && (
                                    <span className={`pointer-events-none absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] font-semibold text-white ${isHomePage ? "bg-black/80 ring-2 ring-white/60" : "bg-neutral-900 ring-2 ring-white"}`}>
                                        {itemCount > 99 ? "99+" : itemCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href={`/${store.slug}/wishlist`}
                                className={`relative inline-flex h-10 w-10 items-center justify-center transition-colors ${isHomePage ? "hover:opacity-80" : "hover:bg-muted/70 rounded-full"}`}
                                aria-label="Wishlist"
                            >
                                <HugeiconsIcon icon={FavouriteIcon} size={18} className={iconColor} />
                            </Link>

                            <Link
                                href={`/a/${store.slug}/login?next=${encodeURIComponent(`/a/${store.slug}`)}`}
                                className={`relative inline-flex h-10 w-10 items-center justify-center transition-colors ${isHomePage ? "hover:opacity-80" : "hover:bg-muted/70 rounded-full"}`}
                                aria-label="Account"
                            >
                                <HugeiconsIcon icon={UserIcon} size={18} className={iconColor} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {isSearchOpen && (
                <div className={`sm:hidden px-4 pb-3 ${isHomePage ? "bg-transparent" : "bg-background border-b border-border"}`}>
                    <StorefrontSearch
                        storeSlug={store.slug}
                        isHomePage={isHomePage}
                        onSubmitted={() => setIsSearchOpen(false)}
                    />
                </div>
            )}
        </header>
    );
}