'use client';

import { useRouter } from 'next/router';

type Props = {
  Icon: React.ElementType;
  text: string;
};

export default function SideMenuNavLink({ Icon, text }: Props) {
  const router = useRouter();
  const { pathname } = router;
  console.log(pathname);
  return (
    <div className="flex h-12 w-[100%] items-center justify-center border-r-4 border-indigo-500 bg-gray-800">
      <div className="flex w-[80%] items-center justify-center">
        <div className="opacity-90">
          <Icon className="mr-4 text-indigo-500" height={24} width={24} />
        </div>
        <div className="font-['General Sans']  text-base font-medium leading-none text-slate-50">
          {text}
        </div>
      </div>
    </div>
  );
}
