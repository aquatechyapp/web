'use client';

import { routes } from '@/constants';
import SideMenuNavLink from './SideMenuNavLink';

export default function SideMenuNav() {
  return (
    <aside className="col-span-1  bg-black">
      <div className="inline-flex h-[100%] w-full flex-col items-start justify-start gap-4 bg-black shadow-inner">
        <div className="flex h-[72px] flex-col items-center justify-start gap-2.5 self-stretch px-6 pb-7 pt-6">
          <div className="inline-flex h-5 items-center justify-center gap-3 self-stretch">
            <div className="shrink grow basis-0 self-stretch text-center">
              <span className="font-['General Sans'] text-xl font-semibold leading-tight text-white">
                Aquatechy
              </span>
              <span className="font-['General Sans'] text-xl font-semibold leading-tight text-indigo-600">
                .
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink grow basis-0 flex-col items-start justify-start gap-2 self-stretch">
          {routes.map((route) => {
            return (
              <SideMenuNavLink
                key={route.href}
                href={route.href}
                Icon={route.icon}
                text={route.text}
              />
            );
          })}
        </div>
        {/* <div className="flex w-full flex-col justify-start">
          <SideMenuNavLink
            href="/settings"
            Icon={IoSettingsOutline}
            text="Settings"
          />
          <SideMenuNavLink
            href="/help"
            Icon={IoIosHelpCircleOutline}
            text="Help center"
          />
        </div> */}
      </div>
    </aside>
  );
}
