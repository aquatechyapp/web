'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetServices from '@/hooks/react-query/services/getRequests';
import { useUserStore } from '@/store/user';

import { DataTableRequests } from './DataTableRequests';
import { columns } from './DataTableRequests/columns';

export default function Page() {
  const { data, isLoading } = useGetServices({
    from: '2024-08-01',
    to: '2024-08-30',
    // technicianId: 123,
    // clientId: 456,
    page: 1
  });

  console.log('services', data);

  const user = useUserStore((state) => state.user);

  const router = useRouter();

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  if (isLoading) return <LoadingSpinner />;

  return <DataTableRequests columns={columns} data={data?.services || []} />;
}
