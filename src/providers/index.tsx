'use client';

import { UserProvider } from '@/context/user';
import { ReactQueryProviderComponent } from './ReactQueryProviderComponent';
import { TechniciansProvider } from '@/context/technicians';
import { WeekdayProvider } from '@/context/weekday';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProviderComponent>
      <UserProvider>
        <TechniciansProvider>
          <WeekdayProvider>{children}</WeekdayProvider>
        </TechniciansProvider>
      </UserProvider>
    </ReactQueryProviderComponent>
  );
};
