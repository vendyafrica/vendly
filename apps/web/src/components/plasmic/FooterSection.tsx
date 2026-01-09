"use client";

import { usePlasmicQueryData } from "@plasmicapp/loader-nextjs";
import { useState } from "react";

interface StoreData {
    name: string;
    description: string | null;
    theme: {
        primaryColor: string;
        textColor: string;
    };
    content: {
        newsletterTitle?: string;
        newsletterSubtitle?: string;
    };
}

interface FooterSectionProps {
    storeSlug: string;
    showNewsletter?: boolean;
    className?: string;
}

/**
 * Store footer with newsletter signup and store info.
 */
export function FooterSection({
    storeSlug,
    showNewsletter = true,
    className,
}: FooterSectionProps) {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const { data: store } = usePlasmicQueryData<StoreData>(
        `/store-footer/${storeSlug}`,
        async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const resp = await fetch(`${apiUrl}/api/storefront/${storeSlug}`);
            if (!resp.ok) {
                throw new Error("Failed to fetch store data");
            }
            return resp.json();
        }
    );

    const primaryColor = store?.theme?.primaryColor || "#1a1a2e";
    const textColor = store?.theme?.textColor || "#1a1a2e";
    const storeName = store?.name || "Store";
    const storeDescription = store?.description || "Your one-stop shop for quality products.";
    const newsletterTitle = store?.content?.newsletterTitle || "Stay Updated";
    const newsletterSubtitle = store?.content?.newsletterSubtitle || "Subscribe to get the latest updates on new products and offers.";

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real implementation, send to API
        setSubscribed(true);
    };

    return (
        <footer
            className={className}
            style={{
                backgroundColor: "#f9f9f9",
                color: "#1a1a1a",
                padding: "4rem 3rem 2rem",
                borderTop: "1px solid rgba(0,0,0,0.08)",
            }}
        >
            {showNewsletter && (
                <div
                    style={{
                        maxWidth: "500px",
                        margin: "0 auto 4rem",
                        textAlign: "center",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            marginBottom: "1rem",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                        }}
                    >
                        {newsletterTitle}
                    </h3>
                    <p
                        style={{
                            color: "#666",
                            marginBottom: "1.5rem",
                            fontSize: "0.875rem",
                        }}
                    >
                        {newsletterSubtitle}
                    </p>
                    {subscribed ? (
                        <p style={{ color: "#10b981", fontSize: "0.875rem" }}>Thanks for subscribing!</p>
                    ) : (
                        <form
                            onSubmit={handleSubscribe}
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                                maxWidth: "400px",
                                margin: "0 auto",
                            }}
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                style={{
                                    flex: 1,
                                    padding: "0.875rem 1rem",
                                    border: "1px solid rgba(0,0,0,0.15)",
                                    borderRadius: "2px",
                                    fontSize: "0.875rem",
                                    backgroundColor: "#fff",
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: "0.875rem 2rem",
                                    backgroundColor: primaryColor,
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "2px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontSize: "0.8125rem",
                                    letterSpacing: "1px",
                                    textTransform: "uppercase",
                                    transition: "background 0.3s",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                            >
                                Subscribe
                            </button>
                        </form>
                    )}
                </div>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "3rem",
                    paddingTop: "2rem",
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                    maxWidth: "1200px",
                    margin: "0 auto",
                }}
            >
                <div>
                    <h4
                        style={{
                            fontSize: "1rem",
                            fontWeight: 600,
                            marginBottom: "0.5rem",
                        }}
                    >
                        {storeName}
                    </h4>
                    <p
                        style={{
                            color: "#666",
                            fontSize: "0.8125rem",
                            lineHeight: 1.6,
                        }}
                    >
                        {storeDescription}
                    </p>
                </div>

                <div>
                    <h5
                        style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            marginBottom: "1rem",
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                        }}
                    >
                        Shop
                    </h5>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: "0.625rem" }}>
                            <a href="#products" style={{ color: "#666", textDecoration: "none", fontSize: "0.8125rem", transition: "color 0.2s" }}>
                                All Products
                            </a>
                        </li>
                        <li style={{ marginBottom: "0.625rem" }}>
                            <a href="#categories" style={{ color: "#666", textDecoration: "none", fontSize: "0.8125rem", transition: "color 0.2s" }}>
                                Categories
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h5
                        style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            marginBottom: "1rem",
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                        }}
                    >
                        Support
                    </h5>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: "0.625rem" }}>
                            <a href="#contact" style={{ color: "#666", textDecoration: "none", fontSize: "0.8125rem", transition: "color 0.2s" }}>
                                Contact Us
                            </a>
                        </li>
                        <li style={{ marginBottom: "0.625rem" }}>
                            <a href="#faq" style={{ color: "#666", textDecoration: "none", fontSize: "0.8125rem", transition: "color 0.2s" }}>
                                FAQ
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div
                style={{
                    marginTop: "3rem",
                    paddingTop: "2rem",
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                    textAlign: "center",
                    color: "#999",
                    fontSize: "0.75rem",
                }}
            >
                © {new Date().getFullYear()} {storeName}. Powered by Vendly.
            </div>
        </footer>
    );
}
