
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ subdomain: string; path: string[] }>;
};

export default async function TenantPathPage({ params }: Props) {
  const { subdomain } = await params;
  return <h1>hello</h1>;
}
