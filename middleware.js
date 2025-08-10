import { NextResponse } from 'next/server';

export function middleware(request) {
  // Handle favicon.ico requests
  if (request.nextUrl.pathname === '/favicon.ico') {
    return NextResponse.redirect(new URL('/assets/images/logos/favicon.svg', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/favicon.ico'],
};
