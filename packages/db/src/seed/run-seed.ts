
import { seedPlatformCategories } from "./seed-platform";
import { seedTenants } from "./seed-tenants";
import { seedStores } from "./seed-stores";

async function main() {
    console.log("🚀 Starting Seed Process...");
    const startTime = Date.now();

    try {
        await seedPlatformCategories();
        await seedTenants();
        await seedStores(); // Phase 2

        console.log(`✨ Seed completed in ${Date.now() - startTime}ms`);
        process.exit(0);
    } catch (err: any) {
        console.error("❌ Seed failed:", err.message);
        if (err.code) console.error("Create Code:", err.code);
        if (err.detail) console.error("Detail:", err.detail);
        if (err.table) console.error("Table:", err.table);
        process.exit(1);
    }
}

main();
