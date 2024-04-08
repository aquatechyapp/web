'use client';

import { LoadingSpinner } from '@/app/_components/LoadingSpinner';
import ShowClient from './ShowClient';
import useGetClient from '@/hooks/react-query/clients/getClient';

export default function Page({ params: { id } }) {
  const { data, isLoading } = useGetClient(id);

  if (isLoading) return <LoadingSpinner />;

  return <ShowClient client={data} />;
}
