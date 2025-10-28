'use client';

import { useUnsubscribeClient } from '@/hooks/react-query/clients/unsubscribe';
import { UnsubscribeContent } from '../UnsubscribeContent';

interface Props {
  searchParams: {
    token: string ;
  };
}

export default function Page({ searchParams }: Props) {
  const { mutate, isPending, isError, isSuccess } = useUnsubscribeClient();

  const handleUnsubscribe = () => {
    const params = {
      token: searchParams.token
    };

    mutate(params);
  };

  return (
    <UnsubscribeContent isPending={isPending} isError={isError} isSuccess={isSuccess} onUnsubscribe={handleUnsubscribe} />
  );
}

