"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StorePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or fetch store data
    if (slug) {
      setIsLoading(false);
    }
  }, [slug]);

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Store Not Found</h1>
          <p className="text-muted-foreground">No store specified.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to {slug}</h1>
          <p className="text-muted-foreground">This is the storefront for {slug}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Placeholder for products */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-card rounded-lg shadow-sm border p-4">
              <div className="aspect-square bg-muted rounded-md mb-4"></div>
              <h3 className="font-medium mb-2">Product {item}</h3>
              <p className="text-sm text-muted-foreground mb-2">Description for product {item}</p>
              <p className="font-bold">${(item * 19.99).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
