'use client';

import ActionButtons from './ActionButtons';
import FilterBar from './FilterBar';
import { clientAxios } from '@/services/clientAxios';

import Loading from '../loading';
import { columns } from './DataTableClients/columns';
import { DataTableClients } from './DataTableClients';
import { useQuery } from '@tanstack/react-query';

export default function Page() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientAxios('/clients');
      return response.data;
    },
    staleTime: Infinity
  });

  if (isLoading) return <Loading />;

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6">
        <ActionButtons />
        <FilterBar />
        <DataTableClients columns={columns} data={data} />
      </div>
    );
  }
}
