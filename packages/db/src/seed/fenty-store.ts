import { db } from "../db";
import { 
  createStore, 
  createProduct, 
  createCategory, 
  addProductToCategory, 
  addProductImage,
  getStoreByTenantId 
} from "../storefront-queries";
import { createTenantIfNotExists, getTenantBySlug } from "../tenant-queries";
import { fileURLToPath } from "url";

const FENTY_PRODUCTS = [
  {
    title: "Gloss Bomb Cream Color Drip Lip Cream",
    description: "A lip cream that delivers the shine of a gloss with the comfort of a balm.",
    priceAmount: 2200, // $22.00
    currency: "USD",
    images: [
      "https://images.fentybeauty.com/media/wysiwyg/products/gloss-bomb-cream-color-drip-lip-cream/fenty-gloss-bomb-cream-color-drip-lip-cream-01.jpg",
      "https://images.fentybeauty.com/media/wysiwyg/products/gloss-bomb-cream-color-drip-lip-cream/fenty-gloss-bomb-cream-color-drip-lip-cream-02.jpg"
    ],
    category: "Lips"
  },
  {
    title: "Eaze Drop Blurring Skin Tint",
    description: "A medium-to-full coverage skin tint that blurs, smooths, and covers for up to 12 hours.",
    priceAmount: 3800, // $38.00
    currency: "USD",
    images: [
      "https://images.fentybeauty.com/media/wysiwyg/products/eaze-drop-blurring-skin-tint/fenty-eaze-drop-blurring-skin-tint-01.jpg",
      "https://images.fentybeauty.com/media/wysiwyg/products/eaze-drop-blurring-skin-tint/fenty-eaze-drop-blurring-skin-tint-02.jpg"
    ],
    category: "Face"
  },
  {
    title: "Killawatt Freestyle Highlighter",
    description: "A cream-powder highlighter that delivers an explosive 10-hour glow.",
    priceAmount: 3400, // $34.00
    currency: "USD",
    images: [
      "https://images.fentybeauty.com/media/wysiwyg/products/killawatt-freestyle-highlighter/fenty-killawatt-freestyle-highlighter-01.jpg",
      "https://images.fentybeauty.com/media/wysiwyg/products/killawatt-freestyle-highlighter/fenty-killawatt-freestyle-highlighter-02.jpg"
    ],
    category: "Face"
  },
  {
    title: "Full Frontal Volume, Lift & Curl Mascara",
    description: "A volumizing mascara that delivers instant lift, curl, and volume.",
    priceAmount: 2600, // $26.00
    currency: "USD",
    images: [
      "https://images.fentybeauty.com/media/wysiwyg/products/full-frontal-mascara/fenty-full-frontal-mascara-01.jpg",
      "https://images.fentybeauty.com/media/wysiwyg/products/full-frontal-mascara/fenty-full-frontal-mascara-02.jpg"
    ],
    category: "Eyes"
  },
  {
    title: "Pro Filt'r Soft Matte Longwear Foundation",
    description: "A soft matte, longwear foundation with buildable medium to full coverage.",
    priceAmount: 3500, // $35.00
    currency: "USD",
    images: [
      "https://images.fentybeauty.com/media/wysiwyg/products/pro-filtr-foundation/fenty-pro-filtr-foundation-01.jpg",
      "https://images.fentybeauty.com/media/wysiwyg/products/pro-filtr-foundation/fenty-pro-filtr-foundation-02.jpg"
    ],
    category: "Face"
  },
  {
    title: "Diamond Bomb All-Over Diamond Veil",
    description: "A 3D hyper-glitter highlighter that creates a diamond-like glow.",
    priceAmount: 4200, // $42.00
    currency: "USD",
    images: [
      "https://images.fentybeauty.com/media/wysiwyg/products/diamond-bomb/fenty-diamond-bomb-01.jpg",
      "https://images.fentybeauty.com/media/wysiwyg/products/diamond-bomb/fenty-diamond-bomb-02.jpg"
    ],
    category: "Face"
  },
  {
    title: "Flyliner Longwear Liquid Eyeliner",
    description: "A flexible felt-tip liquid eyeliner for sharp cat eyes and graphic wings.",
    priceAmount: 2200, // $22.00
    currency: "USD",
    images: [
      "https://images.fentybeauty.com/media/wysiwyg/products/flyliner/fenty-flyliner-01.jpg",
      "https://images.fentybeauty.com/media/wysiwyg/products/flyliner/fenty-flyliner-02.jpg"
    ],
    category: "Eyes"
  },
  {
    title: "Lip Bomb Creamy Matte Lipstick",
    description: "A creamy matte lipstick that delivers comfortable wear for up to 12 hours.",
    priceAmount: 2400, // $24.00
    currency: "USD",
    images: [
      "https://images.fentybeauty.com/media/wysiwyg/products/lip-bomb/fenty-lip-bomb-01.jpg",
      "https://images.fentybeauty.com/media/wysiwyg/products/lip-bomb/fenty-lip-bomb-02.jpg"
    ],
    category: "Lips"
  }
];

const FENTY_CATEGORIES = [
  { name: "Lips", slug: "lips", imageUrl: "https://images.fentybeauty.com/media/catalog/category/lips.jpg" },
  { name: "Face", slug: "face", imageUrl: "https://images.fentybeauty.com/media/catalog/category/face.jpg" },
  { name: "Eyes", slug: "eyes", imageUrl: "https://images.fentybeauty.com/media/catalog/category/eyes.jpg" },
  { name: "Body", slug: "body", imageUrl: "https://images.fentybeauty.com/media/catalog/category/body.jpg" }
];

export async function seedFentyStore() {
  console.log("🌟 Starting Fenty Store seed...");
  
  try {
    // Create tenant for Fenty
    const tenantSlug = "fenty";
    await createTenantIfNotExists(tenantSlug);
    const tenant = await getTenantBySlug(tenantSlug);
    if (!tenant) {
      throw new Error(`Failed to load tenant after creation: ${tenantSlug}`);
    }
    console.log("✅ Created tenant:", tenantSlug);
    
    // Check if store already exists
    const existingStore = await getStoreByTenantId(tenant.id);
    if (existingStore) {
      console.log("ℹ️  Fenty store already exists. Skipping seed.");
      return;
    }
    
    // Create the store
    const store = await createStore({
      tenantId: tenant.id,
      name: "Fenty Beauty by Rihanna",
      slug: "fenty",
      description: "Beauty for all. Fenty Beauty by Rihanna creates products for all skin tones, celebrating uniqueness and diversity.",
      logoUrl: "https://images.fentybeauty.com/media/logo/stores/fenty-beauty-logo.png"
    });
    console.log("✅ Created store:", store.name);
    
    // Create categories
    const createdCategories = [];
    for (const categoryData of FENTY_CATEGORIES) {
      const category = await createCategory({
        storeId: store.id,
        ...categoryData
      });
      createdCategories.push(category);
      console.log(`✅ Created category: ${category.name}`);
    }
    
    // Create products
    for (const productData of FENTY_PRODUCTS) {
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
    
    console.log("🎉 Fenty Store seeded successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding Fenty Store:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  seedFentyStore()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
