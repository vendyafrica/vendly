import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const tenant = req.headers.get('x-tenant-subdomain');

  // If no tenant header, redirect to main domain
  if (!tenant && req.nextUrl.pathname !== '/login') {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'vendlyafrica.store';
    return NextResponse.redirect(`https://${rootDomain}`);
  }

  // Pass tenant header to downstream requests
  if (tenant) {
    const res = NextResponse.next();
    res.headers.set('x-tenant-subdomain', tenant);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|favicon.ico).*)',
  ],
};