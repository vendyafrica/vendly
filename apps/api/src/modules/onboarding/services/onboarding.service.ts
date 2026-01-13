import { tenantService } from "../../tenants/services/tenant.service";
import { storeService } from "../../storefront/services/store.service";
import { productService } from "../../products/services/product.service";

export class OnboardingService {
    async completeOnboarding(input: {
        userId: string;
        businessName: string;
        storeName: string;
        storeSlug: string;
        templateId?: string;
        logoUrl?: string;
        skipProductImport?: boolean;
        cssVariables?: Record<string, string>;
    }) {
        // 1. Create Tenant
        const tenantSlug = input.storeSlug; // Simple 1-1 mapping
        const tenant = await tenantService.createTenant(input.userId, input.businessName, tenantSlug);

        // 2. Create Store
        const store = await storeService.createStore({
            tenantId: tenant.id,
            name: input.storeName,
            slug: input.storeSlug,
            templateId: input.templateId,
            cssVariables: input.cssVariables // Pass theme customization
        });

        // 3. Seed Demo Products if skipped import
        if (input.skipProductImport) {
            const demoProducts = [
                { title: "Classic White Tee", price: 2500, description: "Essential cotton t-shirt for everyday wear.", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80" },
                { title: "Denim Jacket", price: 4500, description: "Vintage style denim jacket with modern fit.", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80" },
                { title: "Canvas Sneakers", price: 3000, description: "Comfortable and stylish low-top sneakers.", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80" },
            ];

            await Promise.all(demoProducts.map(p => productService.createProduct({
                tenantId: tenant.id,
                storeId: store.id,
                title: p.title,
                priceAmount: p.price,
                currency: "KES",
                description: p.description,
                imageUrl: p.imageUrl,
            }))); // Note: In future, handle image media object creation correctly
        }

        return { tenant, store };
    }
}

export const onboardingService = new OnboardingService();
