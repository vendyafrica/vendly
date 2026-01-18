import type { ReactNode } from "react";
import type { Metadata } from "next";

interface StorefrontLayoutProps {
    children: ReactNode;
    params: Promise<{ storefront: string }>;
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ storefront: string }>
}): Promise<Metadata> {
    const { storefront } = await params;
    return {
        title: {
            default: storefront,
            template: `%s | ${storefront}`,
        },
        description: `Shop at ${storefront}`,
    };
}

export default async function StorefrontLayout({
    children,
    params
}: StorefrontLayoutProps) {
    const { storefront } = await params;

    return (
        <div className="min-h-screen bg-[#FAF9F6]" data-storefront={storefront}>
            {children}
        </div>
    );
}
