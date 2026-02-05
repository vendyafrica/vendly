import "@vendly/ui/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "../contexts/cart-context";
import { AppSessionProvider } from "../contexts/app-session-context";
import { Providers } from "./providers";
import { auth } from "@vendly/auth";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next"

const nunitoSans = Nunito_Sans({ variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://vendlyafrica.store";
const defaultTitle = "Vendly";
const defaultDescription = "Vendly helps African creators and small sellers turn social audiences into storefronts with built-in payments, delivery, and marketplace discovery.";
const defaultImage = `${siteUrl}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Vendly",
  },
  description: defaultDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: "Vendly",
    images: [{ url: defaultImage, width: 1200, height: 630, alt: "Vendly" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultImage],
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en" className={nunitoSans.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Vendly",
              url: siteUrl,
              logo: `${siteUrl}/vendly.png`,
              sameAs: [
                "https://www.facebook.com/vendlyafrica",
                "https://www.instagram.com/vendlyafrica",
                "https://twitter.com/vendlyafrica",
                "https://www.linkedin.com/company/vendlyafrica",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Vendly",
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <SpeedInsights />
        <Analytics />
        <Providers>
          <AppSessionProvider session={session}>
            <CartProvider>{children}</CartProvider>
          </AppSessionProvider>
        </Providers>
      </body>
    </html>
  );
}
