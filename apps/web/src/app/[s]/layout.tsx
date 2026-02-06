import type { ReactNode } from "react";
import MarketplaceLayout from "../(m)/layout";
import { StorefrontHeader } from "./components/header";

export default function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MarketplaceLayout>
      <div className="relative min-h-screen bg-background text-foreground antialiased">
        <StorefrontHeader />
        <main className="flex flex-col w-full">{children}</main>
      </div>
    </MarketplaceLayout>
  );
}