'use client';

import { routes } from '@/constants';
import SideMenuNavLink from './SideMenuNavLink';

export default function SideMenuNav() {

  return (
    <aside className="col-span-1  bg-gray-900">
      <div className="inline-flex w-full flex-col items-start justify-start gap-4 bg-gray-900 shadow-inner">
        <div className="flex  flex-col items-center justify-start gap-2.5 self-stretch px-6 pb-7 pt-6">
          <div className="inline-flex items-center justify-center gap-3 self-stretch">
            <div className="shrink grow basis-0 self-stretch text-center">
              <span className="text-xl font-semibold  text-gray-50">
                Aquatechy
              </span>
              <span className="text-xl font-semibold  text-blue-500">
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
                submenu={route.submenu as any}
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
