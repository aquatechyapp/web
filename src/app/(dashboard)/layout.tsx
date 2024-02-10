import { Suspense } from 'react';
import SideMenuNav from '../_components/SideMenuNav';
import TopBarMenu from '../_components/TopBarMenu';
import { LoadingSpinner } from '../_components/LoadingSpinner';
import { Providers } from '@/providers';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen w-screen grid-cols-6">
      <Providers>
        <SideMenuNav />
        <div className="col-span-5 bg-[#FAFAFA]">
          <TopBarMenu />
          <main className="px-7">
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          </main>
        </div>
      </Providers>
    </div>
  );
}
