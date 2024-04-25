import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  Icon: React.ElementType;
  text: string;
  href: string;
};

export default function SideMenuNavLink({ Icon, text, href }: Props) {
  let pathname = usePathname();
  pathname = pathname.split('/')[1];

  const isActive = href === '/' + pathname;
  return (
    <Link
      href={href}
      className={`flex h-12 w-full items-center justify-center   ${isActive && 'border-r-4 border-blue-500 bg-gray-800 '}`}
    >
      <div className="flex w-[80%] items-center ">
        <div className="mr-4">
          <Icon
            className={`opacity-90 ${isActive ? 'text-blue-500' : 'text-gray-300'}`}
            height={24}
            width={24}
          />
        </div>
        <div className="w-full  text-base font-medium leading-none text-slate-50">
          {text}
        </div>
      </div>
    </Link>
  );
}
