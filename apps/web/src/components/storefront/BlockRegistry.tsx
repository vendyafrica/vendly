import { HeroSection } from "./primitives/HeroSection";
import { ProductGrid } from "./primitives/ProductGrid";
import { FeaturedSections } from "./primitives/FeaturedSections";

export const BlockRegistry = {
    hero: HeroSection,
    products: ProductGrid,
    categories: FeaturedSections,
    banner: FeaturedSections, // Fallback for banner
    // Add other mappings as needed
};

export type BlockType = keyof typeof BlockRegistry;
