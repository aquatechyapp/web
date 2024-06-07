import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  // for public routes, we don't need to check for a token
  const pathname = req.nextUrl.pathname;
  if (
    pathname.startsWith('/login') || // exclude login
    pathname.startsWith('/signup') || // exclude signup
    pathname.startsWith('/userconfirmation') // exclude userconfirmation
  ) {
    return NextResponse.next();
  }

  // check if token exists
  const token = req.cookies.get('accessToken')?.value;

  if (!token) {
    return NextResponse.rewrite(new URL('/login', req.url));
  }

  // verify token
  let decodedToken;
  try {
    decodedToken = await jwtVerify(token, new TextEncoder().encode(`${process.env.JWT_SECRET}`));
  } catch (err) {
    return NextResponse.rewrite(new URL('/login', req.url));
  }

  // if token is not valid, redirect to login page
  if (!decodedToken) {
    return NextResponse.rewrite(new URL('/login', req.url));
  }

  // if token is valid, allow access to the dashboard
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
