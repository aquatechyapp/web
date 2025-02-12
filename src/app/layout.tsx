import './globals.css';

import { GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { ReactQueryProviderComponent } from '@/providers/ReactQueryProviderComponent';

import { Toaster } from '../components/ui/toaster';

const poppins = localFont({
  src: [
    {
      path: '../../public/fonts/Poppins-Bold.ttf',
      weight: '700'
    },
    {
      path: '../../public/fonts/Poppins-SemiBold.ttf',
      weight: '600'
    },
    {
      path: '../../public/fonts/Poppins-Regular.ttf',
      weight: '300'
    }
  ]
});

export const metadata: Metadata = {
  title: 'Aquatechy',
  description:
    'Professional pool service management platform. Streamline your pool maintenance operations, track chemical readings, manage routes, and organize service schedules efficiently.',
  icons: [
    {
      href: '/images/favicon.ico',
      sizes: 'any',
      url: '/images/favicon.ico'
    }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-KPJ5P65V" />
      <body className={poppins.className}>
        <Analytics />
        <ReactQueryProviderComponent>{children}</ReactQueryProviderComponent>
        <Toaster />
      </body>
    </html>
  );
}
