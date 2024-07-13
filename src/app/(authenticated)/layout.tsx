'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Suspense } from 'react';

import { SideMenu } from '@/components/SideMenuNav';
import { Colors } from '@/constants/colors';
import { AssignmentsProvider } from '@/context/assignments';
import useGetUser from '@/hooks/react-query/user/getUser';

import { LoadingSpinner } from '../../components/LoadingSpinner';
import TopBarMenu from '../../components/TopBarMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
  const userId = Cookies.get('userId');
  const { push } = useRouter();

  if (!userId) {
    push('/login');
  }
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
