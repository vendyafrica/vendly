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
export const metadata: Metadata = {
  title: {
    default: "Vendly",
    template: "%s | Vendly",
  },
  description: "Vendly - Find your next favorite product",
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
        className={`${geistSans.variable} ${geistMono.variable} bg-[#F9F9F7] antialiased`}
      >
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
