import axios from 'axios';
import { cookies } from 'next/headers';

const baseUrl = process.env.API_URL;

export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': '*',
    // 'Access-Control-Allow-Headers': '*',
    // 'Access-Control-Allow-Credentials': true
  }
});

api.interceptors.request.use(
  (config) => {
    if (config.url === '/login' || config.url === '/signup') {
      return config;
    }
    const accessToken = cookies().get('accessToken')?.value;
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      // NextResponse.redirect('http://localhost:3000/login');
      return config;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);
