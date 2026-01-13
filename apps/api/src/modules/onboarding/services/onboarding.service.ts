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
        logoUrl?: string; // Optional
    }) {
        // 1. Create Tenant
        // Derive tenant slug from business name or store slug?
        // Let's use store slug for tenant slug for now as simpler 1-1 mapping in simple case
        const tenantSlug = input.storeSlug;

        const tenant = await tenantService.createTenant(input.userId, input.businessName, tenantSlug);

        // 2. Create Store
        const store = await storeService.createStore({
            tenantId: tenant.id,
            name: input.storeName,
            slug: input.storeSlug,
            templateId: input.templateId,
        });

        // 3. (Optional) Create Demo Products if needed?
        // Let's add standard demo products if template is chosen
        if (input.templateId) {
            // We can call product service to seed products or just rely on the fact that the store is empty
            // Maybe create 3 placeholder products
            const demoProducts = [
                { title: "Sample Product 1", price: 1000 },
                { title: "Sample Product 2", price: 2500 },
                { title: "Sample Product 3", price: 1500 },
            ];

            await Promise.all(demoProducts.map(p => productService.createProduct({
                tenantId: tenant.id,
                storeId: store.id,
                title: p.title,
                priceAmount: p.price,
                currency: "KES",
                description: "This is a sample product.",
            })));
        }

        return { tenant, store };
    }
}

export const onboardingService = new OnboardingService();
