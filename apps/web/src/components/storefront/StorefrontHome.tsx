"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/client";
import { storeSettingsQuery, homepageQuery, headerQuery, footerQuery } from "@/sanity/queries";
import { buildCssVarsFromDesignSystem } from "@/sanity/lib/buildCssVars";
import SectionRenderer from "@/components/sections/SectionRenderer";
import Header from "@/components/marketplace/header";
import Footer from "@/components/marketplace/footer";

interface StorefrontData {
  settings: any;
  homepage: any;
  header: any;
  footer: any;
}

export function StorefrontHome({ storeSlug }: { storeSlug: string }) {
  const [data, setData] = useState<StorefrontData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Fetch all store content from Sanity
        const [settings, homepage, header, footer] = await Promise.all([
          client.fetch(storeSettingsQuery, { storeId: storeSlug }),
          client.fetch(homepageQuery, { storeId: storeSlug }),
          client.fetch(headerQuery, { storeId: storeSlug }),
          client.fetch(footerQuery, { storeId: storeSlug }),
        ]);

        setData({ settings, homepage, header, footer });
      } catch (err) {
        console.error("Error fetching store data:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [storeSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto" />
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !data?.settings) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Store Unavailable</h1>
          <p className="mt-2 text-sm text-gray-500">
            {error?.message || "We couldn't load this store. Please ensure it's set up in Sanity CMS."}
          </p>
        </div>
      </div>
    );
  }

  // Build CSS variables from design system
  const cssVarStyle = buildCssVarsFromDesignSystem(data.settings.designSystem);

  return (
    <div className="min-h-screen" style={cssVarStyle}>
      <Header />

      {/* Render homepage sections from Sanity */}
      {data.homepage?.sections && (
        <SectionRenderer sections={data.homepage.sections} />
      )}

      {/* If no sections, show a default message */}
      {(!data.homepage?.sections || data.homepage.sections.length === 0) && (
        <div className="content-container py-24 px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to {data.settings.storeName}</h2>
          <p className="text-gray-600 mb-8">
            Your store is ready! Add sections in Sanity Studio to build your homepage.
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
}
