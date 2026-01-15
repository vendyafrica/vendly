"use client";

import { buildCssVarsFromDesignSystem } from "@/sanity/lib/buildCssVars";
import SectionRenderer from "@/components/sections/SectionRenderer";
import Header from "./Header";
import Footer from "./Footer";

interface StorefrontData {
  settings: any;
  homepage: any;
  header: any;
  footer: any;
}

export function StorefrontHome({ storeSlug, isDraftMode, initialData }: { storeSlug: string, isDraftMode?: boolean, initialData: StorefrontData }) {
  const data = initialData;

  if (!data?.settings) {
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

  // Build CSS variables from design system
  const cssVarStyle = buildCssVarsFromDesignSystem(data.settings.designSystem);

  return (
    <div className="min-h-screen" style={cssVarStyle}>
      <Header data={data.header} />

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

      <Footer data={data.footer} />
    </div>
  );
}
