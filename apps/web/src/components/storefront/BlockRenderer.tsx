"use client";

import { BlockRegistry, BlockType } from "./BlockRegistry";

interface BlockRendererProps {
    sections: any[]; // Using any[] to match the flexible schema, but we should ideally type it
    storeSlug: string;
    storeName: string;
    store: any; // Passing full store object for access to details
    products: any[];
}

export function BlockRenderer({ sections, storeSlug, storeName, store, products }: BlockRendererProps) {
    if (!sections || !Array.isArray(sections)) return null;

    console.log("BlockRenderer received sections:", sections);
    return (
        <>
            {sections.map((section, index) => {
                if (!section.enabled) return null;

                const BlockComponent = BlockRegistry[section.type as BlockType] as React.ComponentType<any>;

                if (!BlockComponent) {
                    console.warn(`No component found for block type: ${section.type}`);
                    return null;
                }

                // Prepare props based on block type
                const commonProps = {
                    storeSlug,
                    storeName,
                };

                let specificProps = {};

                if (section.type === "products") {
                    specificProps = {
                        products,
                        title: section.title,
                        showViewAll: true,
                        ...section.settings,
                    };
                } else if (section.type === "hero") {
                    specificProps = {
                        store,
                        content: {
                            heroLabel: section.label,
                            heroTitle: section.title,
                            heroSubtitle: section.subtitle,
                            heroCta: section.ctaText,
                            heroImageUrl: section.imageUrl
                        }
                    }
                } else if (section.type === "categories" || section.type === "banner") {
                    specificProps = {
                        images: section.settings?.images || [], // Assuming images might be passed in settings for now
                    }
                }

                return (
                    <BlockComponent
                        key={`${section.type}-${index}`}
                        {...commonProps}
                        {...specificProps}
                        // Pass through raw content/settings as fallback or for specialized usage
                        content={section.content}
                        settings={section.settings}
                    />
                );
            })}
        </>
    );
}
