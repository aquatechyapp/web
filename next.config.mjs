/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },

  // Em produção, ajustar isso
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'aquatechybeta.s3.amazonaws.com'
  //     },
  //     {
  //       protocol: 'https',
  //       hostname: 'via.placeholder.com'
  //     }
  //   ]
  // },
  env: {
    API_URL: process.env.API_URL,
  },
  pageExtensions: ['ts', 'tsx']
};

export default nextConfig;
