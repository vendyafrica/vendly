import "@vendly/ui/globals.css";
import type { Metadata } from "next";
import { Roboto,Geist_Mono,Geist } from "next/font/google";
import type { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next"

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'});


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
  description: "Vendly",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
   return (
    <html lang="en" className={roboto.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SpeedInsights/>
        {children}
      </body>
    </html>
  );
}
