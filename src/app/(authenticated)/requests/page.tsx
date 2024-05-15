'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetRequests from '@/hooks/react-query/requests/getRequests';

import { DataTableRequests } from './DataTableRequests';
import { columns } from './DataTableRequests/columns';
import { ModalAddRequest } from './ModalAddRequest';

export default function Page() {
  const { data, isLoading } = useGetRequests();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="rounded-md border">
      <div className="flex w-full items-center justify-between px-2 py-4">
        <div className="flex w-full">
          <ModalAddRequest />
        </div>
      </div>
      <DataTableRequests columns={columns} data={data.requests || []} />
    </div>
  );
}
