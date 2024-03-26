'use client';

import { UserProvider } from '@/context/user';
import { ReactQueryProviderComponent } from './ReactQueryProviderComponent';
import { TechniciansProvider } from '@/context/technicians';
import { WeekdayProvider } from '@/context/weekday';
import { AssignmentsProvider } from '@/context/assignments';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProviderComponent>
      <UserProvider>
        <TechniciansProvider>
          <WeekdayProvider>
            <AssignmentsProvider>{children}</AssignmentsProvider>
          </WeekdayProvider>
        </TechniciansProvider>
      </UserProvider>
    </ReactQueryProviderComponent>
  );
};
