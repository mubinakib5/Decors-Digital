import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and public pages
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    !pathname.startsWith('/admin')
  ) {
    return NextResponse.next();
  }
  
  // Allow access to NextAuth auth pages and prevent redirect loops
  if (pathname.startsWith('/admin/auth/')) {
    return NextResponse.next();
  }
  
  // Allow access to legacy login pages
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return NextResponse.next();
  }
  
  // Check authentication for other admin routes
  // First check NextAuth token
  const nextAuthToken = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  console.log('Middleware - NextAuth token:', nextAuthToken ? 'exists' : 'null');
  console.log('Middleware - Token role:', nextAuthToken?.role);
  console.log('Middleware - Pathname:', pathname);
  console.log('Middleware - Full token details:', nextAuthToken);
  
  if (nextAuthToken && (nextAuthToken.role === 'admin' || nextAuthToken.role === 'user')) {
    console.log('Middleware - NextAuth authentication successful');
    return NextResponse.next();
  }
  
  // Fallback to legacy admin token for backward compatibility
  const legacyToken = request.cookies.get('admin-token');
  
  if (legacyToken && legacyToken.value && legacyToken.value.length > 10) {
    return NextResponse.next();
  }
  
  // No valid authentication found, redirect to NextAuth signin
  const loginUrl = new URL('/admin/auth/signin', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
