'use client';

import { columns } from './DataTableClients/columns';
import { DataTableClients } from './DataTableClients';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetClients from '@/hooks/react-query/clients/getClients';

export default function Page() {
  const { data, isLoading, isSuccess } = useGetClients();

  if (isLoading) return <LoadingSpinner />;

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6">
        <DataTableClients columns={columns} data={data} />
      </div>
    );
  }
}
