'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetRequests from '@/hooks/react-query/requests/getRequests';
import { useUserStore } from '@/store/user';

import { DataTableRequests } from './DataTableRequests';
import { columns } from './DataTableRequests/columns';

export default function Page() {
  const { data, isLoading } = useGetRequests();

  console.log('data', data?.requests);

  const user = useUserStore((state) => state.user);

  const router = useRouter();

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  if (isLoading) return <LoadingSpinner />;

  return <DataTableRequests columns={columns} data={data.requests || []} />;
}
