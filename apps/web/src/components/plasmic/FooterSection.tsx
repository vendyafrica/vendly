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
                backgroundColor: "#1f2937",
                color: "#fff",
                padding: "4rem 2rem 2rem",
            }}
        >
            {showNewsletter && (
                <div
                    style={{
                        maxWidth: "600px",
                        margin: "0 auto 3rem",
                        textAlign: "center",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 600,
                            marginBottom: "0.5rem",
                        }}
                    >
                        {newsletterTitle}
                    </h3>
                    <p
                        style={{
                            color: "rgba(255,255,255,0.7)",
                            marginBottom: "1.5rem",
                        }}
                    >
                        {newsletterSubtitle}
                    </p>
                    {subscribed ? (
                        <p style={{ color: "#10b981" }}>Thanks for subscribing!</p>
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
                                    padding: "0.75rem 1rem",
                                    borderRadius: "0.5rem",
                                    border: "none",
                                    fontSize: "1rem",
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: "0.75rem 1.5rem",
                                    backgroundColor: primaryColor,
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Subscribe
                            </button>
                        </form>
                    )}
                </div>
            )}

            <div
                style={{
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    paddingTop: "2rem",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                }}
            >
                <div>
                    <h4
                        style={{
                            fontSize: "1.25rem",
                            fontWeight: 600,
                            marginBottom: "0.25rem",
                        }}
                    >
                        {storeName}
                    </h4>
                    <p
                        style={{
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "0.875rem",
                            maxWidth: "300px",
                        }}
                    >
                        {storeDescription}
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "2rem",
                    }}
                >
                    <div>
                        <h5
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                marginBottom: "0.75rem",
                                color: "rgba(255,255,255,0.8)",
                            }}
                        >
                            Shop
                        </h5>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: "0.5rem" }}>
                                <a href="#products" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.875rem" }}>
                                    All Products
                                </a>
                            </li>
                            <li style={{ marginBottom: "0.5rem" }}>
                                <a href="#categories" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.875rem" }}>
                                    Categories
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                marginBottom: "0.75rem",
                                color: "rgba(255,255,255,0.8)",
                            }}
                        >
                            Support
                        </h5>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: "0.5rem" }}>
                                <a href="#contact" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.875rem" }}>
                                    Contact Us
                                </a>
                            </li>
                            <li style={{ marginBottom: "0.5rem" }}>
                                <a href="#faq" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.875rem" }}>
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginTop: "2rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: "0.875rem",
                }}
            >
                © {new Date().getFullYear()} {storeName}. Powered by Vendly.
            </div>
        </footer>
    );
}
