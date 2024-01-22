import TabIcon from '@/components/ui/tab-icon';
import SideMenuNavLink from './SideMenuNavLink';
import CustomerIcon from '@/components/ui/customer-icon';
import RouteIcon from '@/components/ui/route-icon';
import TeamIcon from '@/components/ui/team-icon';
import { AvatarIcon, DashboardIcon } from '@radix-ui/react-icons';

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
          <SideMenuNavLink Icon={TabIcon} text="Dashboard" />
          <SideMenuNavLink Icon={CustomerIcon} text="Customers" />
          <SideMenuNavLink Icon={RouteIcon} text="Routes" />
          <SideMenuNavLink Icon={TeamIcon} text="My team " />
          <SideMenuNavLink Icon={DashboardIcon} text="Integrations" />
          <SideMenuNavLink Icon={AvatarIcon} text="My Account " />
        </div>
        <div className="flex flex-col items-start justify-start">
          <div className="flex h-[108px] flex-col items-start justify-start gap-1 self-stretch pb-2">
            <div className="relative h-12 bg-black">
              <div className="absolute left-[24px] top-[12px] h-6 opacity-90" />
              <div className="font-['General Sans'] absolute left-[71px] top-[16px] text-base font-medium leading-none text-zinc-100">
                Settings
              </div>
            </div>
            <div className="relative h-12 bg-black">
              <div className="absolute left-[24px] top-[12px] h-6  opacity-90" />
              <div className="font-['General Sans'] absolute left-[71px] top-[16px] text-base font-medium leading-none text-zinc-100">
                Help center
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
