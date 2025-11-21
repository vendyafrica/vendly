import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@vendly/ui/globals.css"
import { Analytics } from '@vercel/analytics/next';
import { Providers } from "@/components/providers"

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Vendly: Launch Your Online Store in Minutes | E-commerce Platform for Africa",
  description: "Launch a professional online store from WhatsApp or Instagram in minutes. Accept M-Pesa payments, automate delivery, and grow your business. Built for African entrepreneurs.",
  keywords: "online store builder, e-commerce platform Africa, M-Pesa payments, Instagram store, WhatsApp business, African entrepreneurs, online selling Kenya, social commerce",
  authors: [{ name: "Vendly" }],
  creator: "Vendly",
  publisher: "Vendly",
  
  applicationName: "Vendly",
  
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon1.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://vendly.africa',
    siteName: 'Vendly',
    title: 'Vendly: Launch Your Online Store in Minutes',
    description: 'Professional e-commerce platform for African entrepreneurs. Import from Instagram, accept M-Pesa, automate delivery. Start selling in minutes.',
    images: [
      {
        url: 'https://vendly.africa/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vendly - E-commerce Platform for Africa',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@vendly',
    creator: '@vendly',
    title: 'Vendly: Launch Your Online Store in Minutes',
    description: 'Professional e-commerce platform for African entrepreneurs. Accept M-Pesa, automate delivery, grow your business.',
    images: ['https://vendly.africa/twitter-image.png'],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  alternates: {
    canonical: 'https://vendly.africa',
  },
  
  verification: {
    google: 'your-google-verification-code',
  },
};

// JSON-LD Structured Data for Organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Vendly',
  alternateName: 'Vendly Africa',
  url: 'https://vendly.africa',
  logo: 'https://vendly.africa/logo.png',
  description: 'E-commerce platform helping African entrepreneurs launch professional online stores in minutes',
  foundingDate: '2024',
  foundingLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KE',
      addressLocality: 'Nairobi',
    },
  },
  sameAs: [
    // 'https://twitter.com/vendly',
    // 'https://www.instagram.com/vendly',
    // 'https://www.linkedin.com/company/vendly',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    availableLanguage: ['English', 'Swahili'],
  },
};

// JSON-LD for WebSite with Search Action
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Vendly',
  url: 'https://vendly.africa',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://vendly.africa/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// JSON-LD for SoftwareApplication
const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Vendly',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KES',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '250',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#ffffff" />

          {/* Enhanced Meta Tags */}
          <meta name="author" content="Vendly" />
          <meta name="geo.region" content="KE" />
          <meta name="geo.placename" content="Nairobi" />

          {/* Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
          />

          {/* Preconnect to improve performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className={`${geist.variable} antialiased`}>
          <main>{children}</main>
          <Analytics />
        </body>
      </html>
    </Providers>
  );
}