
import { db } from "./db";
import { tenants, stores, templates } from "./schema/index";
import { desc, eq } from "drizzle-orm";

async function main() {
    console.log("Checking recent stores...");
    const recentStores = await db.query.stores.findMany({
        orderBy: [desc(stores.createdAt)],
        limit: 5,
        with: {
            tenant: true
        }
    });

    console.log("Recent Stores:", JSON.stringify(recentStores, null, 2));

    console.log("\nChecking Templates...");
    const allTemplates = await db.query.templates.findMany();
    console.log("Templates:", JSON.stringify(allTemplates.map(t => ({ id: t.id, name: t.name, slug: t.slug })), null, 2));

    process.exit(0);
}

main();
