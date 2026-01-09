// Redirect to main storefront page which uses Plasmic template
import TenantPage from "../page";

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ subdomain: string }>;
};

export default async function ProductsPage({ params }: Props) {
    // For now, redirect to main Plasmic storefront which shows products
    return TenantPage({ params });
}
