import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-JWNNZYPEX5";

const geistSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Inter({
  variable: "--font-inter",
  subsets: ["latin"], 
});

const siteUrl = "https://vendlyafrica.store";
const marketplaceUrl = "https://duuka.store";
const defaultTitle = "Vendly | Build Your Online Shop from Social Media Posts";
const defaultDescription =
  "Turn your Instagram and TikTok into an online store. Vendly gives African creators instant storefronts, seamless payments, delivery logistics, and marketplace visibility — scale your social commerce business in minutes.";
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
    template: "%s | Vendly",
  },
  description: defaultDescription,
  robots: { index: true, follow: true },
  alternates: {
    canonical: siteUrl,
    types: {
      "text/html": marketplaceUrl,
    },
  },
  openGraph: {
    title: "Vendly | Turn Your Social Media into an Online Store",
    description: defaultDescription,
    url: siteUrl,
    siteName: "Vendly",
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: "Vendly – Online storefronts for African sellers on Instagram & TikTok",
      },
    ],
    locale: "en_UG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendly | Online Store for Instagram & TikTok Sellers in Uganda",
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
      name: "Vendly",
      legalName: "Vendly Africa",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/vendly.png`,
        width: 512,
        height: 512,
      },
      description: defaultDescription,
      foundingDate: "2025",
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
      name: "Vendly",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${marketplaceUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#app`,
      name: "Vendly",
      url: siteUrl,
      applicationCategory: "ShoppingApplication",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript",
      creator: { "@id": `${siteUrl}/#organization` },
      featureList: [
        "Pinterest-style visual storefront builder",
        "WhatsApp order integration",
        "Marketplace product discovery",
        "Mobile-first browsing experience",
        "Social seller onboarding from Instagram & TikTok",
        "Centralized African brand discovery",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free to start — premium features coming soon",
        availability: "https://schema.org/InStock",
      },
      screenshot: `${siteUrl}/og-image.png`,
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#service`,
      name: "Vendly Social Commerce Platform",
      serviceType: "Social Commerce Marketplace",
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: [
        { "@type": "Country", name: "Uganda" },
        { "@type": "Place", name: "East Africa" },
      ],
      audience: [
        { "@type": "Audience", audienceType: "Social Media Sellers" },
        { "@type": "Audience", audienceType: "Small and Medium Businesses" },
        { "@type": "Audience", audienceType: "Online Shoppers" },
        { "@type": "Audience", audienceType: "Fashion & Lifestyle Store Owners" },
      ],
      description:
        "A social-commerce marketplace platform enabling Instagram and social media sellers to create Pinterest-style storefronts with direct WhatsApp ordering for the African market.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free to start",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

