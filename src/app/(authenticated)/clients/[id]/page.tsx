'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetClient from '@/hooks/react-query/clients/getClient';

import ShowClient from './ShowClient';

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params: { id } }: Props) {
  const { data, isLoading } = useGetClient(id);
  if (isLoading) return <LoadingSpinner />;

  return <ShowClient client={data} />;
}
