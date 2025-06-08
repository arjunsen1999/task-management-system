import { NextResponse } from 'next/server';


export function middleware(request) {
  const token = request.cookies.get('token')?.value;

  const isAuth = !!token;

  const { pathname } = request.nextUrl;

  // Protect dashboard route(s)
  if (pathname.startsWith('/dashboard') && !isAuth) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware only for dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
