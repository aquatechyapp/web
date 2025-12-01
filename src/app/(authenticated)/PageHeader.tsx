'use client';

import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { AccountDropdownMenu } from './AccountDropdownMenu';
import { PageTitle } from './PageTitle';
import { MobileSideMenu } from './SideMenuNav';
import { useUserStore } from '@/store/user';

export default function PageHeader() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resetUser = useUserStore((state) => state.resetUser);

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('userId');
    queryClient.resetQueries();
    queryClient.clear();
    queryClient.removeQueries();

    // localStorage.clear();
    // sessionStorage.clear();
    // queryClient.invalidateQueries({ queryKey: ['companies'] });
    // queryClient.invalidateQueries({ queryKey: ['clients'] });
    // queryClient.invalidateQueries({ queryKey: ['services'] });
    // queryClient.invalidateQueries({ queryKey: ['assignments'] });
    // queryClient.invalidateQueries({ queryKey: ['schedule'] });
    // queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
    // queryClient.invalidateQueries({ queryKey: ['service-types'] });
    // queryClient.invalidateQueries({ queryKey: ['allClients'] });
    // queryClient.invalidateQueries({ queryKey: ['allAssignments'] });
    // queryClient.invalidateQueries({ queryKey: ['companyMembers'] });
    // queryClient.invalidateQueries({ queryKey: ['consumable-definitions'] });
    // queryClient.invalidateQueries({ queryKey: ['consumable-groups'] });
    // queryClient.invalidateQueries({ queryKey: ['photo-definitions'] });
    // queryClient.invalidateQueries({ queryKey: ['photo-groups'] });
    // queryClient.invalidateQueries({ queryKey: ['pools'] });
    // queryClient.invalidateQueries({ queryKey: ['reading-definitions'] });
    // queryClient.invalidateQueries({ queryKey: ['reading-groups'] });
    // queryClient.invalidateQueries({ queryKey: ['requests'] });
    // queryClient.invalidateQueries({ queryKey: ['selectorDefinitions'] });
    // queryClient.invalidateQueries({ queryKey: ['selectorGroups'] });
    // queryClient.invalidateQueries({ queryKey: ['selectorOptions'] });
    // queryClient.invalidateQueries({ queryKey: ['user'] });

    resetUser();
    router.push('/login');
  };

  return (
    <div className="inline-flex max-h-20 w-full items-center bg-gray-800 px-4 py-2 shadow-inner lg:bg-gray-50 lg:py-4">
      <div className="lg:hidden">
        <MobileSideMenu />
      </div>
      <div className="hidden justify-start lg:inline">
        <PageTitle />
      </div>
      <div className="ml-auto flex items-start justify-end gap-2">
        <AccountDropdownMenu handleLogout={handleLogout} />
      </div>
    </div>
  );
}
