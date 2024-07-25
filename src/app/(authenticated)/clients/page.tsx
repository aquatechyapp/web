'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetClients from '@/hooks/react-query/clients/getClients';
import { Client } from '@/interfaces/Client';

import { DataTableClients } from './DataTableClients';
import { columns } from './DataTableClients/columns';

export default function Page() {
  const { data, isLoading, isSuccess } = useGetClients();

  if (isLoading) return <LoadingSpinner />;

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6">
        <DataTableClients columns={columns} data={data as Client[]} />
      </div>
    );
  }
}
