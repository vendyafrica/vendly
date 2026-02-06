import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import "@vendly/ui/globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vendly - Turn Your Social Audience Into a Real Business",
  description:
    "Vendly helps African creators and small sellers turn social media audiences into scalable online businesses with built-in storefronts, payments, and delivery.",
  keywords: [
    "social commerce",
    "Africa",
    "creator economy",
    "online store",
    "WhatsApp selling",
    "Instagram selling",
    "TikTok selling",
    "mobile money payments",
    "e-commerce Uganda",
  ],
  authors: [{ name: "Vendly Africa" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vendly.africa",
    siteName: "Vendly",
    title: "Vendly - Turn Your Social Audience Into a Real Business",
    description:
      "Vendly helps African creators and small sellers turn social media audiences into scalable online businesses with built-in storefronts, payments, and delivery.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vendly - Social Commerce for Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendly - Turn Your Social Audience Into a Real Business",
    description:
      "Built-in storefronts, payments, and delivery for African creators and sellers.",
    images: ["/og-image.png"],
    creator: "@vendlyafrica",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${dmSans.variable} ${outfit.variable}`}
        style={{
          fontFamily: "var(--font-outfit), system-ui, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
