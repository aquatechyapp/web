'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import ShowClient from './ShowClient';
import useGetClient from '@/hooks/react-query/clients/getClient';

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
