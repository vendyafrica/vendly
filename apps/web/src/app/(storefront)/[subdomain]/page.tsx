import { StorefrontTemplate } from "@/components/storefront/store-front";
import { getStorefrontData } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ subdomain: string }>;
};

/**
 * Tenant Storefront Page
 *
 * This page renders the universal storefront template for any tenant.
 * The subdomain is extracted from the URL to identify the store.
 *
 * TODO: When backend is ready, replace getStorefrontData with actual API calls:
 * - GET /api/public/stores/:slug - Store info + hero images
 * - GET /api/public/stores/:slug/products - All products
 * - GET /api/public/stores/:slug/products/new - New arrivals
 */
export default async function TenantPage({ params }: Props) {
  const { subdomain } = await params;

  // TODO: Replace with API call when backend is ready
  // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  // const storeRes = await fetch(`${API_URL}/api/public/stores/${subdomain}`);
  // const productsRes = await fetch(`${API_URL}/api/public/stores/${subdomain}/products`);
  // const newArrivalsRes = await fetch(`${API_URL}/api/public/stores/${subdomain}/products/new?limit=8`);

  try {
    const data = await getStorefrontData(subdomain);

    return <StorefrontTemplate data={data} />;
  } catch (error) {
    console.error("Error loading storefront:", error);

    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold mb-4">Store Not Found</h1>
          <p className="text-neutral-600">
            We couldn&apos;t find a store with this address.
          </p>
        </div>
      </div>
    );
  }
}
