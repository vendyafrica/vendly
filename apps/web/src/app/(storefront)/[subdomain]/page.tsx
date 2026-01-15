import { StorefrontHome } from "@/components/storefront/StorefrontHome";
import { draftMode } from "next/headers";
import { client } from "@/sanity/client";
import { storeSettingsQuery, homepageQuery, headerQuery, footerQuery } from "@/sanity/queries";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ subdomain: string }>;
};

export default async function TenantPage({ params }: Props) {
  const { subdomain } = await params;
  const isDraftMode = (await draftMode()).isEnabled;

  const clientToUse = client.withConfig({
    token: process.env.SANITY_API_TOKEN,
    perspective: isDraftMode ? 'previewDrafts' : 'published',
    stega: {
      enabled: isDraftMode,
      studioUrl: (process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:4000') + `/${subdomain}/studio`
    },
    useCdn: !isDraftMode
  });

  console.log('[TenantPage] Fetching data for subdomain:', subdomain, 'isDraftMode:', isDraftMode);

  try {
    const [settings, homepage, header, footer] = await Promise.all([
      clientToUse.fetch(storeSettingsQuery, { storeId: subdomain }),
      clientToUse.fetch(homepageQuery, { storeId: subdomain }),
      clientToUse.fetch(headerQuery, { storeId: subdomain }),
      clientToUse.fetch(footerQuery, { storeId: subdomain }),
    ]);

    console.log('[TenantPage] Fetched data:', {
      hasSettings: !!settings,
      hasHomepage: !!homepage,
      hasHeader: !!header,
      hasFooter: !!footer,
      storeName: settings?.storeName
    });

    const data = {
      settings,
      homepage,
      header,
      footer
    };

    return (
      <StorefrontHome
        storeSlug={subdomain}
        isDraftMode={isDraftMode}
        initialData={data}
      />
    );
  } catch (error) {
    console.error("Error fetching store data:", error);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Store Unavailable</h1>
          <p className="mt-2 text-sm text-gray-500">
            We couldn't load this store. Please ensure it's set up in Sanity CMS.
          </p>
        </div>
      </div>
    );
  }
}
