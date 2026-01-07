import {
  createStore,
  createProduct,
  createCategory,
  addProductToCategory,
  addProductImage,
  getStoreByTenantId
} from "../queries/storefront-queries";
import { createTenantIfNotExists, getTenantBySlug, setTenantStatus } from "../queries/tenant-queries";
import { fileURLToPath } from "url";

const SHOE_PRODUCTS = [
  {
    title: "Air Max 90 Sneakers",
    description: "Classic running shoes with visible Air cushioning for ultimate comfort.",
    priceAmount: 12000, // $120.00
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800"
    ],
    category: "Sneakers"
  },
  {
    title: "Leather Derby Shoes",
    description: "Formal leather derby shoes perfect for business meetings and special occasions.",
    priceAmount: 18000, // $180.00
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800"
    ],
    category: "Formal"
  },
  {
    title: "Ultra Boost Running Shoes",
    description: "High-performance running shoes with responsive cushioning for athletes.",
    priceAmount: 14000, // $140.00
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1521312192469-aad252074224?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1521312192469-aad252074224?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800"
    ],
    category: "Running"
  },
  {
    title: "Canvas High-Tops",
    description: "Stylish canvas high-top sneakers for casual everyday wear.",
    priceAmount: 6500, // $65.00
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800"
    ],
    category: "Casual"
  },
  {
    title: "Hiking Boots Waterproof",
    description: "Durable waterproof hiking boots with excellent grip for outdoor adventures.",
    priceAmount: 11000, // $110.00
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800"
    ],
    category: "Outdoor"
  },
  {
    title: "Basketball High-Tops",
    description: "Professional basketball shoes with ankle support and superior traction.",
    priceAmount: 13000, // $130.00
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800"
    ],
    category: "Sports"
  },
  {
    title: "Loafers Classic",
    description: "Comfortable leather loafers perfect for smart-casual occasions.",
    priceAmount: 9500, // $95.00
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800"
    ],
    category: "Formal"
  },
  {
    title: "Training Shoes",
    description: "Versatile training shoes designed for gym workouts and cross-training.",
    priceAmount: 8500, // $85.00
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1578935090563-4b8223b6b9b1?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578935090563-4b8223b6b9b1?w=400&h=500&fit=crop&auto=format&fm=jpg&q=80&w=800"
    ],
    category: "Sports"
  }
];

const SHOE_CATEGORIES = [
  { name: "Sneakers", slug: "sneakers", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop" },
  { name: "Running", slug: "running", imageUrl: "https://images.unsplash.com/photo-1521312192469-aad252074224?w=400&h=300&fit=crop" },
  { name: "Formal", slug: "formal", imageUrl: "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=400&h=300&fit=crop" },
  { name: "Sports", slug: "sports", imageUrl: "https://images.unsplash.com/photo-1578935090563-4b8223b6b9b1?w=400&h=300&fit=crop" },
  { name: "Outdoor", slug: "outdoor", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
  { name: "Casual", slug: "casual", imageUrl: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&h=300&fit=crop" }
];

export async function seedShoeStore() {
  console.log("👟 Starting Shoe Store seed...");

  try {
    // Create tenant for shoe store
    const tenantSlug = "shoemart";
    await createTenantIfNotExists(tenantSlug);
    const tenant = await getTenantBySlug(tenantSlug);
    if (!tenant) {
      throw new Error(`Failed to load tenant after creation: ${tenantSlug}`);
    }
    console.log("✅ Created tenant:", tenantSlug);

    // Check if store already exists
    const existingStore = await getStoreByTenantId(tenant.id);
    if (existingStore) {
      console.log("ℹ️  Shoe store already exists. Skipping seed.");
      return;
    }

    // Create the store
    const store = await createStore({
      tenantId: tenant.id,
      name: "ShoeMart",
      slug: "shoemart",
      description: "Your one-stop shop for quality footwear. From sneakers to formal shoes, we've got you covered.",
      logoUrl: "https://images.unsplash.com/photo-1544966503-7e3c4c4c9b94?w=64&h=64&fit=crop&crop=face"
    });
    console.log("✅ Created store:", store.name);

    // Create categories
    const createdCategories = [];
    for (const categoryData of SHOE_CATEGORIES) {
      const category = await createCategory({
        storeId: store.id,
        ...categoryData
      });
      createdCategories.push(category);
      console.log(`✅ Created category: ${category.name}`);
    }

    // Create products
    for (const productData of SHOE_PRODUCTS) {
      // Create product
      const product = await createProduct({
        storeId: store.id,
        title: productData.title,
        description: productData.description,
        priceAmount: productData.priceAmount,
        currency: productData.currency,
        status: "active"
      });

      // Add product images
      for (let i = 0; i < productData.images.length; i++) {
        await addProductImage({
          productId: product.id,
          url: productData.images[i],
          sortOrder: i
        });
      }

      // Add to category
      const category = createdCategories.find(c => c.name === productData.category);
      if (category) {
        await addProductToCategory(product.id, category.id);
      }

      console.log(`✅ Created product: ${product.title}`);
    }

    // Update tenant status to ready
    await setTenantStatus({ slug: tenantSlug, status: "active" });
    console.log("✅ Set tenant status to ready");

    console.log("🎉 Shoe Store seeded successfully!");

  } catch (error) {
    console.error("❌ Error seeding Shoe Store:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  seedShoeStore()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
