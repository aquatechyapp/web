'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Suspense, useEffect } from 'react';

import { Colors } from '@/constants/colors';
import { AssignmentsProvider } from '@/context/assignments';
import useGetUser from '@/hooks/react-query/user/getUser';

import { LoadingSpinner } from '../../components/LoadingSpinner';
import PageHeader from './PageHeader';
import { SideMenu } from './SideMenuNav';

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
        <PageHeader />
        <main>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="mx-2 mt-2 rounded-md border border-gray-200 p-2 shadow-inner lg:mt-0">
              <AssignmentsProvider>{isLoading ? <LoadingSpinner /> : children}</AssignmentsProvider>
            </div>
          </Suspense>
          <ProgressBar height="6px" color={Colors.blue[500]} options={{ showSpinner: false }} shallowRouting />
        </main>
      </div>
    </div>
  );
}
