"use client";

import * as React from "react";
import { trackStorefrontEvents } from "@/lib/storefront-tracking";

export function StorefrontViewTracker({ storeSlug }: { storeSlug: string }) {
  React.useEffect(() => {
    if (!storeSlug) return;
    void trackStorefrontEvents(storeSlug, [{ eventType: "store_view" }]);
  }, [storeSlug]);

  return null;
}
