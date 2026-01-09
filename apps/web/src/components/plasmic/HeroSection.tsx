"use client";

import { usePlasmicQueryData } from "@plasmicapp/loader-nextjs";

interface StoreData {
    name: string;
    theme: {
        primaryColor: string;
        secondaryColor: string;
        textColor: string;
        backgroundColor: string;
    };
    content: {
        heroLabel?: string;
        heroTitle?: string;
        heroSubtitle?: string;
        heroImageUrl?: string;
    };
}

interface HeroSectionProps {
    storeSlug: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    className?: string;
}

/**
 * Hero section with customizable title, subtitle, and CTA.
 * Fetches store data to apply theme colors and default content.
 */
export function HeroSection({
    storeSlug,
    title,
    subtitle,
    ctaText = "Shop Now",
    ctaLink = "#products",
    className,
}: HeroSectionProps) {
    const { data: store, isLoading } = usePlasmicQueryData<StoreData>(
        `/store-hero/${storeSlug}`,
        async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const resp = await fetch(`${apiUrl}/api/storefront/${storeSlug}`);
            if (!resp.ok) {
                throw new Error("Failed to fetch store data");
            }
            return resp.json();
        }
    );

    if (isLoading) {
        return (
            <section
                className={className}
                style={{
                    minHeight: "60vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f9fafb",
                }}
            >
                <div className="animate-pulse" style={{ textAlign: "center" }}>
                    <div style={{ width: 300, height: 48, backgroundColor: "#e5e7eb", borderRadius: 8, margin: "0 auto 1rem" }} />
                    <div style={{ width: 400, height: 24, backgroundColor: "#e5e7eb", borderRadius: 4, margin: "0 auto" }} />
                </div>
            </section>
        );
    }

    const primaryColor = store?.theme?.primaryColor || "#1a1a2e";
    const secondaryColor = store?.theme?.secondaryColor || "#4a6fa5";
    const backgroundColor = store?.theme?.backgroundColor || "#ffffff";
    const textColor = store?.theme?.textColor || "#1a1a2e";

    const heroTitle = title || store?.content?.heroTitle || store?.name || "Welcome";
    const heroSubtitle = subtitle || store?.content?.heroSubtitle || "Discover our curated collection of premium products.";
    const heroLabel = store?.content?.heroLabel || "New Collection";
    const heroImageUrl = store?.content?.heroImageUrl;

    return (
        <section
            className={className}
            style={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4rem 2rem",
                backgroundColor: backgroundColor,
                backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
            }}
        >
            {heroImageUrl && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                    }}
                />
            )}
            <div
                style={{
                    position: "relative",
                    textAlign: "center",
                    maxWidth: "800px",
                }}
            >
                <span
                    style={{
                        display: "inline-block",
                        padding: "0.5rem 1rem",
                        backgroundColor: secondaryColor,
                        color: "#fff",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "1.5rem",
                    }}
                >
                    {heroLabel}
                </span>
                <h1
                    style={{
                        fontSize: "3rem",
                        fontWeight: 700,
                        color: heroImageUrl ? "#fff" : textColor,
                        marginBottom: "1rem",
                        lineHeight: 1.2,
                    }}
                >
                    {heroTitle}
                </h1>
                <p
                    style={{
                        fontSize: "1.25rem",
                        color: heroImageUrl ? "rgba(255,255,255,0.9)" : "#6b7280",
                        marginBottom: "2rem",
                        maxWidth: "600px",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    {heroSubtitle}
                </p>
                <a
                    href={ctaLink}
                    style={{
                        display: "inline-block",
                        padding: "1rem 2.5rem",
                        backgroundColor: primaryColor,
                        color: "#fff",
                        borderRadius: "0.5rem",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "1rem",
                        transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    {ctaText}
                </a>
            </div>
        </section>
    );
}
