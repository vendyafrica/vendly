import type { Metadata } from "next";
import { Geist} from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
 weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
      <body className={`${geist.variable} antialiased `} >
        <main>{children}</main>
           <Analytics />
      </body>
    </html>
  );
}
