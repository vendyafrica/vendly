import "@vendly/ui/globals.css";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { ThirdParty } from "./third-party";

const nunitoSans = Nunito_Sans({ variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://duuka.store";
const vendlyUrl = "https://vendlyafrica.store";
const defaultTitle = "Duuka | Marketplace for your favorite social media stores";
const defaultDescription =
  "Discover and shop from instagram and tiktok stores. Browse visual storefronts, order via WhatsApp, and support independent brands — all on Duuka.";
const defaultImage = `${siteUrl}/og-image.png`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Duuka",
  },
  description: defaultDescription,
  robots: { index: true, follow: true },
  alternates: {
    canonical: siteUrl,
    types: {
      "text/html": vendlyUrl,
    },
  },
  openGraph: {
    title: "Duuka | Discover & Shop from your favorite social media stores",
    description: defaultDescription,
    url: siteUrl,
    siteName: "Duuka",
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: "Duuka — Marketplace for your favorite social media stores",
      },
    ],
    locale: "en_UG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Duuka | Discover & Shop from your favorite social media stores",
    description: defaultDescription,
    images: [defaultImage],
    site: "@vendlyafrica",
    creator: "@vendlyafrica",
  },
  other: {
    "geo.region": "UG",
    "geo.placename": "Kampala, Uganda",
    "geo.position": "0.3476;32.5825",
    ICBM: "0.3476, 32.5825",
    "content-language": "en",
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Duuka",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/duuka.png`,
        width: 512,
        height: 512,
      },
      description: defaultDescription,
      parentOrganization: {
        "@type": "Organization",
        name: "Vendly Africa",
        url: vendlyUrl,
      },
      areaServed: [
        { "@type": "Country", name: "Uganda" },
        { "@type": "Place", name: "East Africa" },
      ],
      sameAs: [
        "https://www.instagram.com/vendlyafrica",
        "https://x.com/vendlyafrica",
        "https://www.linkedin.com/company/vendlyafrica",
        "https://www.tiktok.com/@vendlyafrica",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Duuka",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#app`,
      name: "Duuka Marketplace",
      url: siteUrl,
      applicationCategory: "ShoppingApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      creator: { "@id": `${siteUrl}/#organization` },
      featureList: [
        "Pinterest-style visual product browsing",
        "Direct WhatsApp ordering",
        "Independent African brand storefronts",
        "Mobile-first marketplace experience",
        "Category-based store discovery",
        "Secure mobile money payments",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free to browse and shop",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "ItemList",
      "@id": `${siteUrl}/#marketplace`,
      name: "African Brands & Stores on Duuka",
      description:
        "Browse curated storefronts from African creators, fashion brands, and small businesses.",
      itemListOrder: "https://schema.org/ItemListUnordered",
      numberOfItems: 0,
    },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={nunitoSans.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
        <ThirdParty />
        {children}
      </body>
    </html>
  );
}

