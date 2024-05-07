'use client';

import Image from 'next/image';
import { RiMenu2Fill } from 'react-icons/ri';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { routes } from '@/constants';

import SideMenuNavLink from './SideMenuNavLink';

// Documentation: https://ui.shadcn.com/docs/components/sheet
export function MobileSideMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <RiMenu2Fill size={32} className="cursor-pointer text-gray-50" />
      </SheetTrigger>
      <SheetContent side="left" className="w-[253px] bg-gray-900 p-0">
        <aside className="col-span-1  h-full bg-gray-900">
          <div className="inline-flex h-[100%] w-full flex-col items-start justify-start gap-4 bg-gray-900 shadow-inner">
            <div className="mt-10 self-center">
              <Image width={200} height={200} src="/logoHor.png" alt="Aquatechy Logo" />
            </div>
            <div className="flex shrink grow basis-0 flex-col items-start justify-start gap-2 self-stretch">
              {routes.map((route) => {
                return (
                  <SideMenuNavLink
                    key={route.href}
                    href={route.href}
                    Icon={route.icon}
                    text={route.text}
                    submenu={route.submenu}
                  />
                );
              })}
            </div>
          </div>
        </aside>
      </SheetContent>
    </Sheet>
  );
}

export function SideMenu() {
  return (
    <aside className="col-span-1  h-full bg-gray-900">
      <div className="inline-flex h-[100%] w-full flex-col items-start justify-start gap-4 bg-gray-900 shadow-inner">
        <div className="mx-4 mt-6 self-center">
          <Image width={200} height={200} src="/logoHor.png" alt="Aquatechy Logo" />
        </div>
        <div className="flex shrink grow basis-0 flex-col items-start justify-start gap-2 self-stretch">
          {routes.map((route) => {
            return (
              <SideMenuNavLink
                key={route.href}
                href={route.href}
                Icon={route.icon}
                text={route.text}
                submenu={route.submenu}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
}
