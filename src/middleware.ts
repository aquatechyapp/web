
import { NextRequest, NextResponse } from 'next/server';

const whitelist = ['/login', '/signup', '/userconfirmation', '/recover', '/resetpassword', '/server-offline', '/unsubscribe', '/clients/unsubscribe', '/users/unsubscribe', '/geo-blocked'];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Geo-blocking: Block all non-US users (including public routes)
  // Comment out the lines below if you want to allow login/signup from anywhere
  const country = req.geo?.country || req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry') || req.headers.get('x-country-code');
  
  // Only allow US users
  if (country && (country !== 'US' && country !== 'BR')) {
    return NextResponse.rewrite(new URL('/geo-blocked', req.url));
  }

  // for public routes, we don't need to check for a token
  if (whitelist.some((path) => path === pathname)) {
    return NextResponse.next();
  }

  // check if token exists
  const token = req.cookies.get('accessToken')?.value;

  // if no token found, redirect to login page
  if (!token || token === '') {
    return NextResponse.rewrite(new URL('/login', req.url));
  }

  // // verify token
  // let decodedToken;
  // try {
  //   decodedToken = await jwtVerify(token, new TextEncoder().encode(`${process.env.JWT_SECRET}`));
  // } catch (err) {
  //   return NextResponse.rewrite(new URL('/login', req.url));
  // }

  // // if token is not valid, redirect to login page
  // if (!decodedToken) {
  //   return NextResponse.rewrite(new URL('/login', req.url));
  // }

  // if token is valid, allow access to the dashboard
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
