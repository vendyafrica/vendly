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

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico).*)',
  ],
};
