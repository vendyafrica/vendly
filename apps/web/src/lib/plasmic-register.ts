"use client";

import { PLASMIC } from "@/lib/plasmic-init";

// Import custom code components
import { StoreDataProvider } from "@/components/plasmic/StoreDataProvider";
import { ProductsGrid } from "@/components/plasmic/ProductsGrid";
import { StoreHeader } from "@/components/plasmic/StoreHeader";
import { HeroSection } from "@/components/plasmic/HeroSection";
import { FooterSection } from "@/components/plasmic/FooterSection";

// Register custom code components for Plasmic Studio
// These will appear in the insert menu when editing in Studio

PLASMIC.registerComponent(StoreDataProvider, {
    name: "StoreDataProvider",
    description: "Fetches store data and provides it to child components",
    props: {
        storeSlug: {
            type: "string",
            description: "Store subdomain/slug to fetch data for",
        },
        children: "slot",
    },
});

PLASMIC.registerComponent(ProductsGrid, {
    name: "ProductsGrid",
    description: "Displays a grid of products for a store",
    props: {
        storeSlug: {
            type: "string",
            description: "Store subdomain/slug",
        },
        columns: {
            type: "number",
            defaultValue: 4,
            description: "Number of columns in the grid",
        },
        limit: {
            type: "number",
            defaultValue: 12,
            description: "Maximum number of products to display",
        },
    },
});

PLASMIC.registerComponent(StoreHeader, {
    name: "StoreHeader",
    description: "Store header with logo, name, and navigation",
    props: {
        storeSlug: {
            type: "string",
            description: "Store subdomain/slug",
        },
        showCart: {
            type: "boolean",
            defaultValue: true,
            description: "Show cart icon",
        },
    },
});

PLASMIC.registerComponent(HeroSection, {
    name: "HeroSection",
    description: "Hero section with customizable content",
    props: {
        storeSlug: {
            type: "string",
            description: "Store subdomain/slug",
        },
        title: {
            type: "string",
            description: "Hero title (optional, uses store name if empty)",
        },
        subtitle: {
            type: "string",
            description: "Hero subtitle text",
        },
        ctaText: {
            type: "string",
            defaultValue: "Shop Now",
            description: "Call-to-action button text",
        },
        ctaLink: {
            type: "string",
            defaultValue: "#products",
            description: "Call-to-action button link",
        },
    },
});

PLASMIC.registerComponent(FooterSection, {
    name: "FooterSection",
    description: "Store footer with links and newsletter",
    props: {
        storeSlug: {
            type: "string",
            description: "Store subdomain/slug",
        },
        showNewsletter: {
            type: "boolean",
            defaultValue: true,
            description: "Show newsletter signup",
        },
    },
});
