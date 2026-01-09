import { CartProvider } from '@/components/storefront';
import { CartDrawer } from '@/components/storefront';
// Programmatic Plasmic template - fetches products from API (Vercel Blob)
import { PlasmicStorefrontTemplate } from "@/components/plasmic/PlasmicStorefrontTemplate";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ subdomain: string }>;
};

export default async function TenantPage({ params }: Props) {
  const { subdomain } = await params;

  // Render the Plasmic storefront template directly
  // All data (products, store info) is fetched by the client components from the API
  // Products come from Vercel Blob via /api/storefront/:slug/products
  return (
    <CartProvider>
      <PlasmicStorefrontTemplate
        storeSlug={subdomain}
      />
      <CartDrawer />
    </CartProvider>
  );
}
