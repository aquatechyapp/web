'use client';

import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { AccountDropdownMenu } from './AccountDropdownMenu';
import { PageTitle } from './PageTitle';
import { MobileSideMenu } from './SideMenuNav';

export default function PageHeader() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('userId');
    queryClient.resetQueries();
    router.push('/login');
  };
  return (
    <div className="inline-flex max-h-20 w-full items-center bg-gray-800 px-4 py-2 shadow-inner lg:bg-gray-50 lg:py-4">
      <div className="lg:hidden">
        <MobileSideMenu />
      </div>
      <div className="hidden justify-start lg:inline">
        <PageTitle />
      </div>
      <div className="ml-auto flex items-start justify-end gap-2">
        {/* <Link
          href="/account"
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 p-3"
        >
          <div className="font-['General Sans'] text-center text-sm font-medium leading-[14px] text-gray-50">
            My account
          </div>
        </Link> */}
        {/* <div className="flex items-center justify-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <MdNotificationsNone />
        </div>
        <div className="flex items-center justify-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <IoIosSearch />
        </div> */}
        <AccountDropdownMenu handleLogout={handleLogout} />
      </div>
    </div>
  );
}
