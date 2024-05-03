'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Suspense } from 'react';

import { SideMenu } from '@/components/SideMenuNav';
import { Colors } from '@/constants/colors';
import { AssignmentsProvider } from '@/context/assignments';
import { TechniciansProvider } from '@/context/technicians';
import { UserProvider } from '@/context/user';
import { WeekdayProvider } from '@/context/weekday';

import { LoadingSpinner } from '../../components/LoadingSpinner';
import TopBarMenu from '../../components/TopBarMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen w-full lg:grid-cols-6">
      <div className="hidden h-full lg:inline">
        <SideMenu />
      </div>
      <div className="col-span-5 bg-gray-50">
        <TopBarMenu />
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="px-4 py-1">
              <UserProvider>
                <TechniciansProvider>
                  <WeekdayProvider>
                    <AssignmentsProvider>{children}</AssignmentsProvider>
                  </WeekdayProvider>
                </TechniciansProvider>
              </UserProvider>
            </div>
          </Suspense>
          <ProgressBar height="4px" color={Colors.blue[500]} options={{ showSpinner: false }} shallowRouting />
        </main>
      </div>
    </div>
  );
}
