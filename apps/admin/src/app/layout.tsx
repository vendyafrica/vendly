import "@vendly/ui/globals.css";
import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import type { ReactNode } from "react";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Vendly",
    template: "%s | Vendly",
  },
  description: "Vendly",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={barlow.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
