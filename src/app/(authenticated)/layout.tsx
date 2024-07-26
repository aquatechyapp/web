'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Suspense, useEffect } from 'react';

import { Colors } from '@/constants/colors';
import { AssignmentsProvider } from '@/context/assignments';
import useGetUser from '@/hooks/react-query/user/getUser';

import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SideMenu } from './SideMenuNav';
import TopBarMenu from './TopBarMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
  const userId = Cookies.get('userId') as string;
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      router.push('/login');
    }
  }, []);

  const { isLoading } = useGetUser({ userId });

  return (
    <div className="h-screen w-full lg:grid lg:grid-cols-6">
      <div className="hidden h-full lg:inline">
        <SideMenu />
      </div>
      <div className="col-span-5 bg-gray-50">
        <TopBarMenu />
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="px-2 py-1 sm:px-4">
              <AssignmentsProvider>{isLoading ? <LoadingSpinner /> : children}</AssignmentsProvider>
            </div>
          </Suspense>
          <ProgressBar height="6px" color={Colors.blue[500]} options={{ showSpinner: false }} shallowRouting />
        </main>
      </div>
    </div>
  );
}
