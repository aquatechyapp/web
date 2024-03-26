'use client';

import { clientAxios } from '@/services/clientAxios';

import { columns } from './DataTableClients/columns';
import { DataTableClients } from './DataTableClients';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '@/app/_components/LoadingSpinner';

export default function Page() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientAxios('/clients');
      return response.data;
    },
    staleTime: Infinity
  });

  if (isLoading) return <LoadingSpinner />;

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6">
        <DataTableClients columns={columns} data={data} />
      </div>
    );
  }
}
