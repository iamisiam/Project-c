import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add user info to headers for use in components
  const response = NextResponse.next();
  response.headers.set('x-user-id', payload.userId.toString());
  response.headers.set('x-couple-id', payload.coupleId.toString());

  return response;
}

export const config = {
  matcher: ['/((?!api/login|api/register|login|_next/static|_next/image|favicon.ico).*)'],
};