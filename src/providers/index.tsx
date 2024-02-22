'use client';

import { LoadingProvider } from '@/context/user';
import { ReactQueryProviderComponent } from './ReactQueryProviderComponent';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProviderComponent>
      <LoadingProvider>{children}</LoadingProvider>
    </ReactQueryProviderComponent>
  );
};
