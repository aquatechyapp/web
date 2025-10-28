'use client';

import { useSearchParams } from 'next/navigation';
import { useUnsubscribeUser } from '@/hooks/react-query/user/unsubscribe';
import { UnsubscribeContent } from '../UnsubscribeContent';

export default function Page() {
  const searchParams = useSearchParams();
  const { mutate, isPending, isError, isSuccess } = useUnsubscribeUser();

  const handleUnsubscribe = () => {
    const token = searchParams.get('token');
    
    if (!token) {
      console.error('Token not found in URL');
      return;
    }

    const params = {
      token
    };

    mutate(params);
  };

  return (
    <UnsubscribeContent isPending={isPending} isError={isError} isSuccess={isSuccess} onUnsubscribe={handleUnsubscribe} />
  );
}

