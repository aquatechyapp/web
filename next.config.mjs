/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  env: {
    API_URL: process.env.API_URL
  },
  pageExtensions: ['ts', 'tsx']
};

export default nextConfig;
