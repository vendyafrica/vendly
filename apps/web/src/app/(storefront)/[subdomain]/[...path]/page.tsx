import TenantPage from "../page";

export const dynamic = 'force-dynamic';

type Props = {
  params: { subdomain: string; path: string[] };
};

export default async function TenantPathPage({ params }: Props) {
  return TenantPage({ params: { subdomain: params.subdomain } });
}
