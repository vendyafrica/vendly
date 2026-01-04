import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'vendlyafrica.store';

function getSubdomain(req: NextRequest) {
  const host = (req.headers.get('x-forwarded-host') ?? req.headers.get('host'))?.split(':')[0];
  if (!host) return null;

  if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) {
    return null;
  }

  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    return host.replace(`.${ROOT_DOMAIN}`, '');
  }

  if (host.endsWith('.localhost')) {
    return host.replace('.localhost', '');
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

    // Rewrite root to tenant page
    if (pathname === '/') {
      return NextResponse.rewrite(
        new URL(`/${subdomain}`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico).*)',
  ],
};
