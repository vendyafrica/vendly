"use client";

import { useState, useEffect } from "react";
import type { Store } from "@/constants/stores";
import type { Category } from "@/constants/stores";

interface CategoryStoresResponse {
  stores: Store[];
  count: number;
  category: Category;
}

export function useCategoryStores(category: Category) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategoryStores() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/stores/${category}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Category not found');
          }
          throw new Error('Failed to fetch stores');
        }
        
        const data: CategoryStoresResponse = await response.json();
        setStores(data.stores);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchCategoryStores();
    }
  }, [category]);

  return { stores, loading, error };
}
