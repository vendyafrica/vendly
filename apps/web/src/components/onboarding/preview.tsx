'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '../../contexts/onboarding-context';
import { Button } from "@vendly/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@vendly/ui/components/card";
import Header from '../marketplace/header';
import Footer from '../marketplace/footer';
import HeroSection from '../sections/HeroSection';
import ProductGridSection from '../sections/ProductGridSection';
import BannerSection from '../sections/BannerSection';

export const PreviewStep = () => {
    const router = useRouter();
    const { data } = useOnboarding();
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Redirect to admin studio after viewing preview
    const handleContinueToStudio = () => {
        setIsRedirecting(true);
        // Redirect to admin studio
        const adminUrl = `${process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:4000'}/${data.tenantSlug}/studio`;
        window.location.href = adminUrl;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Preview Banner */}
            <div className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">🎉 Your Store is Ready!</h2>
                        <p className="text-sm opacity-90">This is a preview of your store with sample content</p>
                    </div>
                    <Button
                        onClick={handleContinueToStudio}
                        variant="secondary"
                        size="lg"
                        disabled={isRedirecting}
                    >
                        {isRedirecting ? 'Redirecting...' : 'Customize in Studio →'}
                    </Button>
                </div>
            </div>

            {/* Storefront Preview */}
            <div className="bg-white">
                <Header />

                {/* Hero Section */}
                <HeroSection
                    title={`Welcome to ${data.storeName}`}
                    subtitle="Discover amazing products curated just for you"
                    layout="centered"
                    ctaText="Shop Now"
                    ctaLink="/collections"
                />

                {/* Product Grid */}
                <ProductGridSection
                    title="Featured Products"
                    columns={4}
                    productSource="featured"
                    limit={8}
                />

                {/* Banner */}
                <BannerSection
                    text="Free shipping on orders over $100"
                    backgroundColor="primary"
                    ctaText="Learn More"
                    ctaLink="/shipping"
                />

                <Footer />
            </div>

            {/* Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <p className="font-medium">Ready to customize your store?</p>
                        <p className="text-sm text-muted-foreground">Edit content, change design, and add your products in Sanity Studio</p>
                    </div>
                    <Button
                        onClick={handleContinueToStudio}
                        size="lg"
                        disabled={isRedirecting}
                    >
                        {isRedirecting ? 'Redirecting...' : 'Go to Studio →'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
