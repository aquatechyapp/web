import Link from 'next/link';
import { IoIosSearch } from 'react-icons/io';
import { MdNotificationsNone } from 'react-icons/md';
import { DropdownTop } from './DropdownTop';
import { AccountDropdownMenu } from './AccountDropdownMenu';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function TopBarMenu() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('userId');
    router.push('/login');
  };
  return (
    <div className="inline-flex h-20 w-full items-center justify-between bg-white px-9 py-5 shadow-inner">
      <div className="flex items-center justify-start gap-6">
        <div className="flex items-center justify-start gap-6">
          <DropdownTop />
        </div>
      </div>
      <div className="flex items-start justify-start gap-2">
        <Link
          href="/account"
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 p-3"
        >
          <div className="font-['General Sans'] text-center text-sm font-medium leading-[14px] text-white">
            My account
          </div>
        </Link>
        <div className="flex items-center justify-start gap-2 rounded-lg border border-gray-200 bg-white p-3">
          <MdNotificationsNone />
        </div>
        <div className="flex items-center justify-start gap-2 rounded-lg border border-gray-200 bg-white p-3">
          <IoIosSearch />
        </div>
        <AccountDropdownMenu handleLogout={handleLogout} />
      </div>
    </div>
  );
}
