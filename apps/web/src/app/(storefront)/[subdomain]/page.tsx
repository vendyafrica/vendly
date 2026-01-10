import { CartProvider } from '@/components/storefront';
import { CartDrawer } from '@/components/storefront';
import { StorefrontHome } from "@/components/storefront/StorefrontHome";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ subdomain: string }>;
};

export default async function TenantPage({ params }: Props) {
  const { subdomain } = await params;

  return (
    <CartProvider>
      <StorefrontHome storeSlug={subdomain} />
      <CartDrawer />
    </CartProvider>
  );
}
