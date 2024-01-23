'use client';

import TabIcon from '@/components/ui/tab-icon';
import SideMenuNavLink from './SideMenuNavLink';
import CustomerIcon from '@/components/ui/customer-icon';
import RouteIcon from '@/components/ui/route-icon';
import TeamIcon from '@/components/ui/team-icon';
import { AvatarIcon, DashboardIcon } from '@radix-ui/react-icons';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoIosHelpCircleOutline } from 'react-icons/io';

export default function SideMenuNav() {
  return (
    <aside className="col-span-1  bg-black">
      <div className="inline-flex h-[100%] w-[100%] flex-col items-start justify-start gap-4 bg-black shadow-inner">
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
          <SideMenuNavLink href="/dashboard" Icon={TabIcon} text="Dashboard" />
          <SideMenuNavLink href="/clients" Icon={CustomerIcon} text="Clients" />
          <SideMenuNavLink href="/routes" Icon={RouteIcon} text="Routes" />
          <SideMenuNavLink href="/my-team" Icon={TeamIcon} text="My team " />
          <SideMenuNavLink
            href="/integrations"
            Icon={DashboardIcon}
            text="Integrations"
          />
          <SideMenuNavLink
            href="/my-account"
            Icon={AvatarIcon}
            text="My Account "
          />
        </div>
        <div className="flex w-[100%] flex-col justify-start">
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
        </div>
      </div>
    </aside>
  );
}
