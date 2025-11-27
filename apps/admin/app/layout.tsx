// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@vendly/ui/globals.css";
import { SidebarProvider, SidebarInset } from "@vendly/ui/components/sidebar";
import { AppSidebar } from "./dashboard/components/sidebar";
import Header from "./dashboard/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vendly Admin",
  description: "Admin dashboard for Vendly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="vendly" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />

          {/* SidebarInset handles the remaining width next to sidebar */}
          <SidebarInset className="flex flex-col h-screen overflow-hidden">
            {/* Header stays at the top */}
            <Header />

            {/* Main takes remaining height and scrolls internally */}
            <main className="flex-1 overflow-y-auto bg-muted p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
