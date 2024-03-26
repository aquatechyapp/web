'use client';

import { Suspense } from 'react';
import SideMenuNav from '../_components/SideMenuNav';
import TopBarMenu from '../_components/TopBarMenu';
import { LoadingSpinner } from '../_components/LoadingSpinner';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen w-full grid-cols-6">
      <SideMenuNav />
      <div className="col-span-5 bg-[#FAFAFA]">
        <TopBarMenu />
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="p-4">{children}</div>
          </Suspense>
          <ProgressBar
            height="4px"
            color="#3182ce"
            options={{ showSpinner: false }}
            shallowRouting
          />
        </main>
      </div>
    </div>
  );
}
