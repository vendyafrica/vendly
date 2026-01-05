import TenantPage, { dynamic } from "../page";

type Props = {
  params: { subdomain: string; path: string[] };
};

export { dynamic };

export default async function TenantPathPage({ params }: Props) {
  return TenantPage({ params: { subdomain: params.subdomain } });
}
