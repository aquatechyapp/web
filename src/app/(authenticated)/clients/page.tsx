'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { useUserStore } from '@/store/user';

import { DataTableClients } from './DataTableClients';
import { columns } from './DataTableClients/columns';

export default function Page() {
  const [page, setPage] = useState(1);
  const { data: clientsData, isLoading, isSuccess } = useGetClients(page);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) return <LoadingSpinner />;

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 p-2">
        <DataTableClients
          columns={columns}
          data={clientsData?.clients || []}
          totalCount={clientsData?.totalCount || 0}
          currentPage={page}
          onPageChange={handlePageChange}
          itemsPerPage={20}
        />
      </div>
    );
  }
}
