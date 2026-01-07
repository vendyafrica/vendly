import { db } from "../db";
import { platformCategories } from "../schema/core-schema";

const categories = [
    {
        name: "Fashion",
        slug: "fashion",
        imageUrl: "https://v0-blob.vercel.app/platform/fashion.jpg", // Placeholder
        sortOrder: 1,
    },
    {
        name: "Shoes",
        slug: "shoes",
        imageUrl: "https://v0-blob.vercel.app/platform/shoes.jpg", // Placeholder
        sortOrder: 2,
    },
    {
        name: "Accessories",
        slug: "accessories",
        imageUrl: "https://v0-blob.vercel.app/platform/accessories.jpg", // Placeholder
        sortOrder: 3,
    },
    {
        name: "Beauty",
        slug: "beauty",
        imageUrl: "https://v0-blob.vercel.app/platform/beauty.jpg", // Placeholder
        sortOrder: 4,
    },
    {
        name: "Gifts",
        slug: "gifts",
        imageUrl: "https://v0-blob.vercel.app/platform/gifts.jpg", // Placeholder
        sortOrder: 5,
    },
];

export async function seedPlatformCategories() {
    console.log("🌱 Seeding Platform Categories...");

    for (const cat of categories) {
        await db
            .insert(platformCategories)
            .values(cat)
            .onConflictDoUpdate({
                target: platformCategories.slug,
                set: {
                    name: cat.name,
                    imageUrl: cat.imageUrl,
                    sortOrder: cat.sortOrder,
                },
            });
    }

    console.log("✅ Platform Categories seeded");
}
