// 'use client';

import { Suspense } from 'react';
import SideMenuNav from '../_components/SideMenuNav';
import TopBarMenu from '../_components/TopBarMenu';
import { LoadingSpinner } from '../_components/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/services/clientAxios';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/user';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen w-screen grid-cols-6">
      <SideMenuNav />
      <div className="col-span-5 bg-[#FAFAFA]">
        <TopBarMenu />
        <main className="px-7">
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
