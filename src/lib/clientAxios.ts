import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const baseUrl = process.env.API_URL;

export const clientAxios = axios.create({
  baseURL: baseUrl + '/api/v1',
  headers: {
    'Content-Type': ['application/json']
  },
  withCredentials: true
});

clientAxios.interceptors.request.use(
  async (config) => {
    if (config.url === '/login' || config.url === '/signup' || config.url === '/server-offline') {
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

clientAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
      console.log('Network Error');
      // window.location.href = window.location.protocol + '//' + window.location.host + '/server-offline';
    }

    if (error.response?.status === 401) {
      Cookies.remove('accessToken');
      Cookies.remove('userId');
      window.location.href = window.location.protocol + '//' + window.location.host + '/login';
    }
    if (error && error.response && error.response.status >= 500) {
      console.log('Server Error');
      // window.location.href = window.location.protocol + '//' + window.location.host + '/server-error';
    }
    return Promise.reject(error);
  }
);
