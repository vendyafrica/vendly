
import { db } from "./db";
import { tenants } from "./schema/tenant-schema";
import { stores } from "./schema/storefront-schema";
import { products, productVariants, inventoryItems } from "./schema/product-schema";
import { eq } from "drizzle-orm";

async function seedAcmeDB() {
    console.log('🌱 Seeding Database for Acme Store...');

    // 1. Create or Get Tenant
    const [existingTenant] = await db.select().from(tenants).where(eq(tenants.slug, 'acme')).limit(1);
    let tenantId = existingTenant?.id;

    if (!existingTenant) {
        const [newTenant] = await db.insert(tenants).values({
            name: 'Acme Corp',
            slug: 'acme',
            status: 'active',
            plan: 'pro'
        }).returning();
        tenantId = newTenant.id;
        console.log('✅ Created Tenant: Acme Corp');
    } else {
        console.log('ℹ️ Tenant Acme Corp already exists');
    }

    // 2. Create or Get Store
    const [existingStore] = await db.select().from(stores).where(eq(stores.slug, 'acme')).limit(1);
    let storeId = existingStore?.id;

    if (!existingStore) {
        const [newStore] = await db.insert(stores).values({
            tenantId: tenantId!,
            name: 'Acme Store',
            slug: 'acme',
            sanityStoreId: 'acme',
            status: 'active',
            defaultCurrency: 'USD'
        }).returning();
        storeId = newStore.id;
        console.log('✅ Created Store: Acme Store');
    } else {
        console.log('ℹ️ Store Acme Store already exists');
    }

    // 3. Create Sample Products
    // We'll create 4 products to match the "Featured Products" grid
    const productData = [
        { title: 'Classic T-Shirt', price: 2999, slug: 'classic-t-shirt' },
        { title: 'Denim Jacket', price: 8999, slug: 'denim-jacket' },
        { title: 'Running Shoes', price: 12999, slug: 'running-shoes' },
        { title: 'Leather Backpack', price: 15999, slug: 'leather-backpack' },
    ];

    for (const p of productData) {
        // Check if product exists
        const [existingProduct] = await db.select().from(products)
            .where(eq(products.slug, p.slug))
            .limit(1);

        if (existingProduct) {
            console.log(`ℹ️ Product ${p.title} already exists`);
            continue;
        }

        const [product] = await db.insert(products).values({
            tenantId: tenantId!,
            storeId: storeId!,
            title: p.title,
            slug: p.slug,
            description: `Description for ${p.title}`,
            priceAmount: p.price,
            currency: 'USD',
            status: 'active', // Important: must be active to show up
            source: 'manual',
        }).returning();

        // Create Default Variant
        const [variant] = await db.insert(productVariants).values({
            tenantId: tenantId!,
            productId: product.id,
            title: 'Default',
            priceAmount: p.price,
            currency: 'USD',
            sku: `${p.slug}-default`
        }).returning();

        // Create Inventory
        await db.insert(inventoryItems).values({
            variantId: variant.id,
            tenantId: tenantId!,
            quantityOnHand: 100,
            quantityAvailable: 100
        });

        console.log(`✅ Created Product: ${p.title}`);
    }

    console.log('✅ Seeded sample products');
}

seedAcmeDB()
    .then(() => {
        console.log('🎉 Database seeding complete!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Database seeding failed:', err);
        process.exit(1);
    });
