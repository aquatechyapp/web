'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetClient from '@/hooks/react-query/clients/getClient';
import { useUserStore } from '@/store/user';

import ShowClient from './ShowClient';

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params: { id } }: Props) {
  const { data, isLoading } = useGetClient(id);
  const user = useUserStore((state) => state.user);

  const router = useRouter();

  useEffect(() => {
    if (user.firstName === '') {
      router.push('/account');
    }
  }, [user]);

  if (isLoading) return <LoadingSpinner />;

  return <ShowClient client={data} />;
}
