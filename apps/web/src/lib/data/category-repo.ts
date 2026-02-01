import { db } from "@vendly/db/db";
import { categories } from "@vendly/db/schema";
import { eq } from "@vendly/db";

export const categoryRepo = {
    async findAll() {
        return db.select().from(categories);
    },

    async findBySlug(slug: string) {
        return db.query.categories.findFirst({
            where: eq(categories.slug, slug),
        });
    }
};
