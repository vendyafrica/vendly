import { APP_DOMAIN } from "./constants";

export function getShopUrl(shopSlug: string): string {
  // For now, navigate to storefront app on port 4000 with dynamic route
  return `http://localhost:4000/${shopSlug}`;
}
