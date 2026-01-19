
import type { ReactNode } from "react";
import type { Metadata } from "next";

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
