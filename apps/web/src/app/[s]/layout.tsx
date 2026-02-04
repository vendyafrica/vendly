import type { ReactNode } from "react";
import { StorefrontHeader } from "./components/header"; // Adjust path as needed

export default function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased">
      
      <StorefrontHeader />

      <main className="flex flex-col w-full">
        {children}
      </main>

    </div>
  );
}