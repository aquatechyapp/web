'use client';

import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { AccountDropdownMenu } from './AccountDropdownMenu';
import { DropdownTop } from './DropdownTop';
import { MobileSideMenu } from './SideMenuNav';

export default function TopBarMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('userId');
    queryClient.resetQueries();
    router.push('/login');
  };
  return (
    <div className="inline-flex h-16 w-full items-center bg-gray-800 px-9 shadow-inner lg:bg-gray-50">
      <div className="lg:hidden">
        <MobileSideMenu />
      </div>
      <div className="flex items-center justify-start gap-6">
        <div className="flex hidden items-center justify-start gap-6 lg:inline">
          <DropdownTop />
        </div>
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
