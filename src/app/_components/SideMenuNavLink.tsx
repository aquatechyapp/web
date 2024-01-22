import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  Icon: React.ElementType;
  text: string;
  href: string;
};

export default function SideMenuNavLink({ Icon, text, href }: Props) {
  const pathname = usePathname();
  const isActive = href === pathname;
  return (
    <Link
      href={href}
      className={`flex h-12 w-[100%] items-center justify-center   ${isActive && 'border-r-4 border-indigo-500 bg-gray-800 '}`}
    >
      <div className="flex w-[80%] items-center justify-center">
        <div className="opacity-90">
          <Icon
            className={`"mr-4 ${isActive ? 'text-indigo-500' : 'text-gray-300'}`}
            height={24}
            width={24}
          />
        </div>
        <div className="font-['General Sans']  text-base font-medium leading-none text-slate-50">
          {text}
        </div>
      </div>
    </Link>
  );
}
