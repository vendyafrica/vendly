"use client";

import { useState, useEffect } from "react";
import { stores as allStores } from "@/constants/stores";
import type { Store } from "@/constants/stores";
import type { Category } from "@/constants/stores";

// Fetch category stores - using real data from constants
async function fetchCategoryStores(category: Category): Promise<{
  stores: Store[];
  count: number;
  category: Category;
}> {
  // Simulate API delay for realistic loading state
  await new Promise(resolve => setTimeout(resolve, 500));

  // Filter stores by category
  const categoryStores = allStores.filter(store => store.category === category);

  return {
    stores: categoryStores,
    count: categoryStores.length,
    category
  };
}

export function useMockCategoryStores(category: Category) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStores() {
      try {
        setLoading(true);
        setError(null);

        // Replace this with real API call when ready:
        // const response = await fetch(`/api/stores/${category}`);
        // const data = await response.json();

        // For now, use data from constants
        const data = await fetchCategoryStores(category);
        setStores(data.stores);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      loadStores();
    }
  }, [category]);

  return { stores, loading, error };
}
