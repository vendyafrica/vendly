"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../components/providers/onboarding-provider";
import { Button } from "@vendly/ui/components/button";
import { Hero } from "@vendly/ui/components/storefront/hero";
import { ProductGrid } from "@vendly/ui/components/storefront/product-grid";
import { Footer } from "@vendly/ui/components/storefront/primitives/Footer";
import { Header } from "@vendly/ui/components/storefront/primitives/Header";
import { CartProvider } from "@vendly/ui/components/storefront/primitives/CartProvider";
import { HugeiconsIcon } from "@hugeicons/react";
import { Rocket01Icon, CheckmarkCircle01Icon, Loading03Icon } from "@hugeicons/core-free-icons";

// Mock sample products if empty (redundant with customize mock, but okay)
const sampleProducts = [
    { id: "1", title: "Organic Cotton Tee", price: 2500, currency: "KES", imageUrl: "" },
    { id: "2", title: "Denim Jacket", price: 4500, currency: "KES", imageUrl: "" },
    { id: "3", title: "Canvas Sneakers", price: 3000, currency: "KES", imageUrl: "" },
];

import { useSession } from "../../../lib/auth";

export default function PreviewPage() {
    const router = useRouter();
    const { setStep, businessInfo } = useOnboarding();
    const [isPublishing, setIsPublishing] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        setStep(3);
    }, [setStep]);

    const handlePublish = async () => {
        if (!session?.user?.id) {
            console.error("User not authenticated");
            // Optionally redirect to login or show error
            return;
        }

        setIsPublishing(true);
        try {
            const res = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session.user.id,
                    businessName: businessInfo.tenantName || businessInfo.storeName,
                    storeName: businessInfo.storeName,
                    storeSlug: businessInfo.slug,
                    category: businessInfo.category,
                    phone: businessInfo.phone,
                })
            });

            if (!res.ok) throw new Error("Failed to create store");

            const data = await res.json();
            console.log("Store created:", data);

            setIsPublished(true);
        } catch (error) {
            console.error("Publish failed", error);
            setIsPublishing(false);
        }
    };

    if (isPublished) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={40} />
                </div>
                <h1 className="text-3xl font-bold mb-4">You're Live!</h1>
                <p className="text-gray-500 max-w-md mb-8">
                    Your store <strong>{businessInfo.storeName}</strong> has been successfully created and published.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={() => window.open(`http://${businessInfo.slug}.vendlyafrica.store`, '_blank')} variant="outline">
                        View Store
                    </Button>
                    <Button onClick={() => router.push("/dashboard")}>
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-white">
            {/* Top Bar with Publish Action */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-black text-white z-50 flex items-center justify-between px-4 lg:px-8 shadow-md">
                <div className="font-bold flex items-center gap-2">
                    <span className="text-gray-400 font-normal">Previewing:</span>
                    {businessInfo.storeName}
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => router.push("/sell/personal-info")}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10 hover:text-white"
                        disabled={isPublishing}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handlePublish}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
                        disabled={isPublishing}
                    >
                        {isPublishing ? (
                            <span className="flex items-center">
                                <HugeiconsIcon icon={Loading03Icon} className="animate-spin mr-2" />
                                Publishing...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <HugeiconsIcon icon={Rocket01Icon} className="mr-2" />
                                Publish Now
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            {/* Preview Content (Pushed down by header) */}
            <div className="pt-16 min-h-screen">
                <CartProvider>
                    <Header
                        storeName={businessInfo.storeName}
                        storeSlug={businessInfo.slug}
                        navItems={[
                            { label: "Home", href: "#" },
                            { label: "Shop", href: "#" },
                            { label: "About", href: "#" },
                        ]}
                    />

                    <Hero
                        title="Grand Opening"
                        subtitle={`Welcome to ${businessInfo.storeName}. Discover our new collection.`}
                        align="center"
                        ctaText="Start Shopping"
                        ctaLink="#"
                        height="medium"
                    />

                    <ProductGrid
                        title="Latest Arrivals"
                        products={sampleProducts}
                        storeSlug={businessInfo.slug}
                        columns={3}
                    />

                    <Footer
                        storeName={businessInfo.storeName}
                        storeSlug={businessInfo.slug}
                    />
                </CartProvider>
            </div>
        </div>
    );
}
