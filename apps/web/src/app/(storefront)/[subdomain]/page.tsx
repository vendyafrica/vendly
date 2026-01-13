import { StorefrontHome } from "@/components/storefront/StorefrontHome";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ subdomain: string }>;
};

export default async function TenantPage({ params }: Props) {
  const { subdomain } = await params;

  return (
    <StorefrontHome storeSlug={subdomain} />
  );
}
