"use client";

import useSWR from "swr";

export type StorefrontStoreResponse = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  theme?: Record<string, unknown>;
  content?: Record<string, unknown>;
};

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
}

async function fetchJson(url: string) {
  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(text || `Request failed: ${resp.status}`);
  }
  return resp.json();
}

export function useStorefrontStore(storeSlug?: string) {
  const apiBaseUrl = getApiBaseUrl();
  const key = storeSlug ? `${apiBaseUrl}/api/storefront/${storeSlug}` : null;

  const swr = useSWR<StorefrontStoreResponse>(key, fetchJson);

  return {
    store: swr.data,
    isLoading: swr.isLoading,
    error: swr.error,
    mutate: swr.mutate,
  };
}
