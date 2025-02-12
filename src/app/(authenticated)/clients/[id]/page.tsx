'use client';

import { notFound, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import useGetClient from '@/hooks/react-query/clients/getClient';
import { useUserStore } from '@/store/user';

import ShowClient from './ShowClient';

function isValidObjectId(id: string): boolean {
  // Verifica se o ID é uma string de 24 caracteres hexadecimais
  const objectIdRegex = /^[a-fA-F0-9]{24}$/;
  return objectIdRegex.test(id);
}

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params: { id } }: Props) {
  if (!id || !isValidObjectId(id)) {
    notFound();
  }

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
