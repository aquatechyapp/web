import Link from 'next/link';
import { IoIosSearch } from 'react-icons/io';
import { MdNotificationsNone } from 'react-icons/md';
import { DropdownTop } from './DropdownTop';

export default function TopBarMenu() {
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
        <div className="relative h-10 w-10">
          <img
            className="absolute left-0 top-0 h-10 w-10 rounded-full border-2 border-violet-200"
            src="https://via.placeholder.com/40x40"
          />
        </div>
      </div>
    </div>
  );
}
