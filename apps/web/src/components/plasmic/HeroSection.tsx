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
    backgroundImage?: string;
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
    backgroundImage,
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
    const heroImageUrl = backgroundImage || store?.content?.heroImageUrl;

    return (
        <>
            <style jsx>{`
                @media (max-width: 768px) {
                    .hero-section {
                        min-height: 60vh !important;
                    }
                    .hero-content {
                        padding: 2rem 1.5rem !important;
                    }
                    .hero-label {
                        font-size: 0.625rem !important;
                        letter-spacing: 1.5px !important;
                        margin-bottom: 1rem !important;
                    }
                    .hero-title {
                        font-size: 2.5rem !important;
                        line-height: 1.1 !important;
                        margin-bottom: 1rem !important;
                    }
                    .hero-subtitle {
                        font-size: 0.875rem !important;
                        margin-bottom: 2rem !important;
                        max-width: 100% !important;
                    }
                    .hero-cta {
                        padding: 0.875rem 2rem !important;
                        font-size: 0.75rem !important;
                        letter-spacing: 1px !important;
                    }
                }
            `}</style>
            <section
                className={`hero-section ${className || ''}`}
                style={{
                    minHeight: "75vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0",
                    backgroundColor: "#f5f1ed",
                    backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {heroImageUrl && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(0,0,0,0.1)",
                        }}
                    />
                )}
                <div
                    className="hero-content"
                    style={{
                        position: "relative",
                        textAlign: "center",
                        maxWidth: "900px",
                        padding: "4rem 2rem",
                    }}
                >
                    {/* Small Label */}
                    <span
                        className="hero-label"
                        style={{
                            display: "inline-block",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            color: heroImageUrl ? "#fff" : "#666",
                            marginBottom: "1.5rem",
                        }}
                    >
                        {heroLabel}
                    </span>

                    {/* Large Stylized Title */}
                    <h1
                        className="hero-title"
                        style={{
                            fontSize: "5.5rem",
                            fontWeight: 300,
                            fontStyle: "italic",
                            color: heroImageUrl ? "#fff" : textColor,
                            marginBottom: "1.5rem",
                            lineHeight: 0.95,
                            fontFamily: "'Playfair Display', Georgia, serif",
                            textShadow: heroImageUrl ? "0 2px 20px rgba(0,0,0,0.3)" : "none",
                        }}
                    >
                        {heroTitle}
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="hero-subtitle"
                        style={{
                            fontSize: "0.9375rem",
                            color: heroImageUrl ? "rgba(255,255,255,0.95)" : "#666",
                            marginBottom: "2.5rem",
                            maxWidth: "500px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            letterSpacing: "0.5px",
                            fontWeight: 400,
                        }}
                    >
                        {heroSubtitle}
                    </p>

                    {/* CTA Button */}
                    <a
                        href={ctaLink}
                        className="hero-cta"
                        style={{
                            display: "inline-block",
                            padding: "1rem 3rem",
                            backgroundColor: heroImageUrl ? "#fff" : primaryColor,
                            color: heroImageUrl ? "#1a1a1a" : "#fff",
                            borderRadius: "2px",
                            textDecoration: "none",
                            fontWeight: 500,
                            fontSize: "0.8125rem",
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                            transition: "all 0.3s ease",
                            border: heroImageUrl ? "1px solid #fff" : `1px solid ${primaryColor}`,
                        }}
                        onMouseEnter={(e) => {
                            if (heroImageUrl) {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#fff";
                            } else {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = primaryColor;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (heroImageUrl) {
                                e.currentTarget.style.backgroundColor = "#fff";
                                e.currentTarget.style.color = "#1a1a1a";
                            } else {
                                e.currentTarget.style.backgroundColor = primaryColor;
                                e.currentTarget.style.color = "#fff";
                            }
                        }}
                    >
                        {ctaText}
                    </a>
                </div>
            </section>
        </>
    );
}
