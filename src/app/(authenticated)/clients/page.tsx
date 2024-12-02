'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { useUserStore } from '@/store/user';

import { DataTableClients } from './DataTableClients';
import { columns } from './DataTableClients/columns';

export default function Page() {
  const { data: clients, isLoading, isSuccess } = useGetClients();
  const user = useUserStore((state) => state.user);

  const router = useRouter();

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  if (isLoading) return <LoadingSpinner />;

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 p-2">
        <DataTableClients columns={columns} data={clients || []} />
      </div>
    );
  }
}
