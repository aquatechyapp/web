'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetClients from '@/hooks/react-query/clients/getClients';

import { DataTableClients } from './DataTableClients';
import { columns } from './DataTableClients/columns';

export default function Page() {
  const { data: clients, isLoading, isSuccess } = useGetClients();

  if (isLoading) return <LoadingSpinner />;

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 p-2">
        <DataTableClients columns={columns} data={clients || []} />
      </div>
    );
  }
}
