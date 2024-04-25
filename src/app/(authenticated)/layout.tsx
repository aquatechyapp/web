'use client';

import { Suspense } from 'react';
import SideMenuNav from '../../components/SideMenuNav';
import TopBarMenu from '../../components/TopBarMenu';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { UserProvider } from '@/context/user';
import { TechniciansProvider } from '@/context/technicians';
import { WeekdayProvider } from '@/context/weekday';
import { AssignmentsProvider } from '@/context/assignments';
import { Colors } from '@/constants/colors';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen w-full grid-cols-6">
      <SideMenuNav />
      <div className="col-span-5 bg-gray-50">
        <TopBarMenu />
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="p-4">
              <UserProvider>
                <TechniciansProvider>
                  <WeekdayProvider>
                    <AssignmentsProvider>{children}</AssignmentsProvider>
                  </WeekdayProvider>
                </TechniciansProvider>
              </UserProvider>
            </div>
          </Suspense>
          <ProgressBar
            height="4px"
            color={Colors.blue[500]}
            options={{ showSpinner: false }}
            shallowRouting
          />
        </main>
      </div>
    </div>
  );
}
