import axios from 'axios';
import Cookies from 'js-cookie';

const baseUrl = process.env.API_URL;

export const clientAxios = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
  // withCredentials: true
});

clientAxios.interceptors.request.use(
  async (config) => {
    if (config.url === '/login' || config.url === '/signup') {
      return config;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    const accessToken = Cookies.get('accessToken');

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
