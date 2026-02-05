"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep data fresh for 2 minutes before marking as stale
            staleTime: 2 * 60 * 1000,
            // Keep inactive data in cache for 5 minutes
            gcTime: 5 * 60 * 1000,
            // Refetch when window regains focus for fresh data
            refetchOnWindowFocus: true,
            // Only refetch if data is stale
            refetchOnMount: "always",
            // Single retry on failure
            retry: 1,
            // Don't retry on 4xx errors
            retryOnMount: true,
          },
          mutations: {
            // Show errors in console during development
            onError: (error) => {
              console.error("Mutation error:", error);
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
