'use client';

import { LoadingProvider } from '@/context';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <LoadingProvider>{children}</LoadingProvider>;
};
