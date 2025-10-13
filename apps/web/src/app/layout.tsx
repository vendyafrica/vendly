import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
//@ts-ignore
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Adjust if you want different weights
});

export const metadata: Metadata = {
  title: "Vendly",
  description: "Your store beyond the feed",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon1.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased`}>
        <main>{children}</main>
           <Analytics />
      </body>
    </html>
  );
}
