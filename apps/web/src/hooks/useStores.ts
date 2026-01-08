// hooks/useStores.ts
"use client";

import { useState, useEffect } from "react";
import type { Store } from "@/constants/stores";

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStores() {
      try {
        setLoading(true);
        const response = await fetch('/api/stores');
        if (!response.ok) throw new Error('Failed to fetch stores');
        const data = await response.json();
        setStores(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStores();
  }, []);

  return { stores, loading, error };
}