'use client';

import { useUnsubscribeUser } from '@/hooks/react-query/user/unsubscribe';
import { UnsubscribeContent } from '../UnsubscribeContent';

interface Props {
  searchParams: {
    token: string;
  };
}

export default function Page({ searchParams }: Props) {
  const { mutate, isPending, isError, isSuccess } = useUnsubscribeUser();

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

