"use client";

import useSWR from "swr";

export type StorefrontProduct = {
  id: string;
  title: string;
  description?: string | null;
  priceAmount: number;
  currency: string;
  status: string;
  imageUrl?: string;
  originalPrice?: number;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function normalizeProducts(raw: unknown): StorefrontProduct[] {
  const arr: unknown[] = Array.isArray(raw)
    ? raw
    : isRecord(raw) && Array.isArray(raw.data)
      ? (raw.data as unknown[])
      : [];

  const products: StorefrontProduct[] = [];

  for (const item of arr) {
    if (!isRecord(item)) continue;

    const id = getString(item.id) ?? (typeof item.id === "number" ? String(item.id) : "");
    if (!id) continue;

    const title = getString(item.title) ?? getString(item.name) ?? "";

    const priceAmount =
      getNumber(item.priceAmount) ?? getNumber(item.basePriceAmount) ?? 0;

    const currency = getString(item.currency) ?? getString(item.baseCurrency) ?? "KES";

    const status = getString(item.status) ?? "active";

    const imageUrl =
      getString(item.imageUrl) ??
      (() => {
        const images = item.images;
        if (!Array.isArray(images) || images.length === 0) return undefined;
        const first: unknown = images[0];
        if (!isRecord(first)) return undefined;
        return getString(first.url);
      })();

    products.push({
      id,
      title,
      description: (item.description as string | null | undefined) ?? null,
      priceAmount,
      currency,
      status,
      imageUrl,
      originalPrice: getNumber(item.originalPrice) ?? getNumber(item.compareAtPrice),
    });
  }

  return products;
}

export function useStorefrontProducts(storeSlug?: string, opts?: { limit?: number }) {
  const apiBaseUrl = getApiBaseUrl();
  const limit = opts?.limit;

  const url = storeSlug
    ? `${apiBaseUrl}/api/storefront/${storeSlug}/products${limit ? `?limit=${limit}` : ""}`
    : null;

  const swr = useSWR<unknown>(url, fetchJson);

  return {
    products: normalizeProducts(swr.data),
    isLoading: swr.isLoading,
    error: swr.error,
    mutate: swr.mutate,
  };
}
