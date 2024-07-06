import axios from 'axios';
import Cookies from 'js-cookie';

const baseUrl = process.env.API_URL;

export const clientAxios = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

clientAxios.interceptors.request.use(
  async (config) => {
    if (config.url === '/login' || config.url === '/signup') {
      return config;
    }

    const accessToken = Cookies.get('accessToken');

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);
