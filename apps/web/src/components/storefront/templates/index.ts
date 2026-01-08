// Template exports
export * from "./fashion";

export type TemplateCategory = "fashion" | "electronics" | "food" | "general";

export const TEMPLATE_OPTIONS: {
    value: TemplateCategory;
    label: string;
    description: string;
    icon: string;
}[] = [
        {
            value: "fashion",
            label: "Fashion",
            description: "Clothing, accessories, and lifestyle",
            icon: "👗"
        },
        {
            value: "electronics",
            label: "Electronics",
            description: "Gadgets and tech products",
            icon: "📱"
        },
        {
            value: "food",
            label: "Food & Beverage",
            description: "Restaurants and food delivery",
            icon: "🍕"
        },
        {
            value: "general",
            label: "General Store",
            description: "Multi-category retail",
            icon: "🛒"
        },
    ];
