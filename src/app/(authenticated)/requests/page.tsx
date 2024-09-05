'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetRequests from '@/hooks/react-query/requests/getRequests';

import { DataTableRequests } from './DataTableRequests';
import { columns } from './DataTableRequests/columns';

export default function Page() {
  const { data, isLoading } = useGetRequests();

  if (isLoading) return <LoadingSpinner />;

  return <DataTableRequests columns={columns} data={data.requests || []} />;
}
