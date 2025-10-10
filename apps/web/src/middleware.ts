import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Middleware to make production redirects flexible:
 * - If Meta redirects users to the site root "/" with an authorization code
 *   (e.g. https://www.vendlyafrica.store/?code=...),
 *   we rewrite internally to "/instagram/callback" while preserving the query string.
 *
 * This allows you to register either:
 *   - https://www.vendlyafrica.store/
 *   - https://www.vendlyafrica.store/instagram/callback
 * as the redirect URI in Meta's Business Login settings, while keeping the
 * callback handling logic centralized in apps/web/src/app/instagram/callback/page.tsx
 */
export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // If Instagram redirects to the root with ?code=..., rewrite to the callback page
  if (url.pathname === "/" && url.searchParams.has("code")) {
    const rewriteTo = new URL(`/instagram/callback${url.search}`, req.url);
    return NextResponse.rewrite(rewriteTo);
  }

  // No special handling needed
  return NextResponse.next();
}

/**
 * Optional: limit middleware to only paths where it's relevant.
 * Matching root ("/") is sufficient for the redirect hack.
 */
export const config = {
  matcher: ["/"],
};