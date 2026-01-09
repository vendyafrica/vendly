import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import { StoreDataProvider } from "../components/plasmic/StoreDataProvider";
import { ProductsGrid } from "../components/plasmic/ProductsGrid";
import { StoreHeader } from "../components/plasmic/StoreHeader";
import { HeroSection } from "../components/plasmic/HeroSection";
import { FooterSection } from "../components/plasmic/FooterSection";

// Initialize Plasmic with project credentials
// Get these from your Plasmic project:
// - Project ID: from URL https://studio.plasmic.app/projects/PROJECTID
// - API Token: click "Code" button in Plasmic Studio toolbar
export const PLASMIC = initPlasmicLoader({
    projects: [
        {
            id: process.env.NEXT_PUBLIC_PLASMIC_PROJECT_ID || "PROJECTID",
            token: process.env.NEXT_PUBLIC_PLASMIC_API_TOKEN || "APITOKEN",
        },
    ],
    // Fetches latest revisions in dev, only published in production
    preview: process.env.NODE_ENV !== "production",
});

// Register code components for use in Plasmic Studio
PLASMIC.registerComponent(StoreDataProvider, {
    name: "StoreDataProvider",
    displayName: "Store Data Provider",
    description: "Fetches and provides store data to child components",
    props: {
        storeSlug: {
            type: "string",
            displayName: "Store Slug",
            description: "The unique slug of the store to fetch data for",
            defaultValue: "demo-store",
        },
        children: {
            type: "slot",
            displayName: "Content",
        },
    },
    providesData: true,
});

PLASMIC.registerComponent(ProductsGrid, {
    name: "ProductsGrid",
    displayName: "Products Grid",
    description: "Displays a grid of products for a store",
    props: {
        storeSlug: {
            type: "string",
            displayName: "Store Slug",
            description: "The unique slug of the store to fetch products for",
            defaultValue: "demo-store",
        },
        columns: {
            type: "number",
            displayName: "Columns",
            description: "Number of columns in the grid",
            defaultValue: 4,
            min: 1,
            max: 6,
        },
        limit: {
            type: "number",
            displayName: "Limit",
            description: "Maximum number of products to display",
            defaultValue: 12,
            min: 1,
            max: 100,
        },
        sectionTitle: {
            type: "string",
            displayName: "Section Title",
            description: "Title displayed above the product grid",
            defaultValue: "SHOP THE COLLECTION",
        },
    },
});

PLASMIC.registerComponent(StoreHeader, {
    name: "StoreHeader",
    displayName: "Store Header",
    description: "Header with store logo, name, and navigation",
    props: {
        storeSlug: {
            type: "string",
            displayName: "Store Slug",
            description: "The unique slug of the store",
            defaultValue: "demo-store",
        },
        showCart: {
            type: "boolean",
            displayName: "Show Cart Icon",
            description: "Whether to display the shopping cart icon",
            defaultValue: true,
        },
        backgroundImage: {
            type: "imageUrl",
            displayName: "Background Image",
            description: "Optional background image for the header",
        },
    },
});

PLASMIC.registerComponent(HeroSection, {
    name: "HeroSection",
    displayName: "Hero Section",
    description: "Hero banner with customizable title, subtitle, and CTA",
    props: {
        storeSlug: {
            type: "string",
            displayName: "Store Slug",
            description: "The unique slug of the store",
            defaultValue: "demo-store",
        },
        title: {
            type: "string",
            displayName: "Title",
            description: "Override default hero title",
        },
        subtitle: {
            type: "string",
            displayName: "Subtitle",
            description: "Override default hero subtitle",
        },
        ctaText: {
            type: "string",
            displayName: "CTA Text",
            description: "Call-to-action button text",
            defaultValue: "Shop Now",
        },
        ctaLink: {
            type: "string",
            displayName: "CTA Link",
            description: "Call-to-action button link",
            defaultValue: "#products",
        },
        backgroundImage: {
            type: "imageUrl",
            displayName: "Background Image",
            description: "Background image for the hero section",
        },
    },
});

PLASMIC.registerComponent(FooterSection, {
    name: "FooterSection",
    displayName: "Footer Section",
    description: "Store footer with newsletter signup and links",
    props: {
        storeSlug: {
            type: "string",
            displayName: "Store Slug",
            description: "The unique slug of the store",
            defaultValue: "demo-store",
        },
        showNewsletter: {
            type: "boolean",
            displayName: "Show Newsletter",
            description: "Whether to display the newsletter signup",
            defaultValue: true,
        },
    },
});
