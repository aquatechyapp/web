import { DropdownTop } from './DropdownTop';
import { AccountDropdownMenu } from './AccountDropdownMenu';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useQueryClient } from '@tanstack/react-query';

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
    <div className="inline-flex h-20 w-full items-center justify-between bg-gray-50 px-9 py-5 shadow-inner">
      <div className="flex items-center justify-start gap-6">
        <div className="flex items-center justify-start gap-6">
          <DropdownTop />
        </div>
      </div>
      <div className="flex items-start justify-start gap-2">
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
