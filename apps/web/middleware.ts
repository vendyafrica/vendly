import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'vendlyafrica.store';
const RESERVED_SUBDOMAINS = new Set(['www', 'admin', 'api', 'ai', 'support', 'docs']);

function getSubdomain(req: NextRequest) {
  const host = (req.headers.get('x-forwarded-host') ?? req.headers.get('host'))?.split(':')[0];
  if (!host) return null;

  if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) {
    return null;
  }

  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = host.replace(`.${ROOT_DOMAIN}`, '');
    if (RESERVED_SUBDOMAINS.has(subdomain)) return null;
    return subdomain;
  }

  if (host.endsWith('.localhost')) {
    const subdomain = host.replace('.localhost', '');
    if (RESERVED_SUBDOMAINS.has(subdomain)) return null;
    return subdomain;
  }

  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const subdomain = getSubdomain(req);

  // Handle subdomain-based routing (e.g., fenty.localhost:3000 or fenty.vendlyafrica.store)
  if (subdomain) {
    // Prevent admin routes on tenant domains
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.startsWith(`/${subdomain}`)) {
      return NextResponse.next();
    }

    const url = req.nextUrl.clone();
    url.pathname = `/${subdomain}${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  // Handle path-based tenant routing for localhost (e.g., localhost:3000/fenty)
  // This allows easy local development without subdomain setup
  const host = req.headers.get('host')?.split(':')[0];
  if (host === 'localhost' || host === '127.0.0.1') {
    // Check if the first path segment could be a tenant slug
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const potentialSlug = pathParts[0];
      // Skip known routes that are not tenant slugs
      const knownRoutes = new Set(['sell', 'api', 'admin', '_next', 'favicon.ico', 'images', 'fonts']);
      if (!knownRoutes.has(potentialSlug) && !potentialSlug.startsWith('_')) {
        // This could be a tenant slug - let it pass through to [subdomain] route
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico).*)',
  ],
};
