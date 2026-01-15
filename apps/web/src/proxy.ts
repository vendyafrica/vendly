import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  const isLocalhost = hostname.includes("localhost");
  const rootDomain = isLocalhost ? "localhost:3000" : (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "vendlyafrica.store");

  // Check if we are on a subdomain
  // e.g. "store1.localhost:3000" -> subdomain is "store1"
  // "localhost:3000" -> no subdomain

  let subdomain = null;

  if (isLocalhost) {
    if (hostname !== "localhost:3000") {
      subdomain = hostname.split(".")[0];
    }
  } else {
    // Production logic (e.g. store1.vendlyafrica.store)
    if (hostname !== rootDomain && hostname.endsWith(`.${rootDomain}`)) {
      subdomain = hostname.replace(`.${rootDomain}`, "");
    }
  }

  // If there's a subdomain, rewrite the path to include it
  // This allows us to use dynamic routes like app/(storefront)/[subdomain]/page.tsx
  if (subdomain && subdomain !== "www") {
    // Rewrite path: /about -> /store1/about
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
  }

  // If no subdomain, we are on the main platform
  // e.g. localhost:3000 -> /
  // This matches app/(platform)/page.tsx (if configured)
  return NextResponse.next();
}
