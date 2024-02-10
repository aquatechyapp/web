import { api } from '@/services/api';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE_NAME, USER_COOKIE_NAME } from '@/constants';

const MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const payload = {
    email,
    password
  };

  try {
    const response = await api.post('/sessions', payload);
    if (response.status !== 200) {
      return NextResponse.json(
        {
          message: 'Unauthorized'
        },
        {
          status: 401
        }
      );
    }

    const token = response.data.accessToken;

    const seralized = serialize(ACCESS_TOKEN_COOKIE_NAME, token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: MAX_AGE,
      path: '/'
    });

    cookies().set(
      USER_COOKIE_NAME,
      serialize(USER_COOKIE_NAME, response.data.user, {
        // httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: MAX_AGE,
        path: '/'
      })
    );

    api.defaults.headers.common['Authorization'] = token;

    return new Response(
      JSON.stringify({ message: 'Authenticated', accessToken: token }),
      {
        status: 200,
        // Seta o cookie no browser
        headers: { 'Set-Cookie': seralized }
      }
    );
  } catch (error) {
    return error;
  }
}
