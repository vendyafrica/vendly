import TenantPage from "../page";

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ subdomain: string }>;
};

export default async function ProductsPage({ params }: Props) {
    return TenantPage({ params });
}
