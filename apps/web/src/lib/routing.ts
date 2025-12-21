import { APP_DOMAIN } from "./constants";

export function getShopUrl(shopSlug: string): string {
  return `https://${shopSlug}.${APP_DOMAIN}`;
}
