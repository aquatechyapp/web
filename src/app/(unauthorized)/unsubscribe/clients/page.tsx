'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useUnsubscribeClient } from '@/hooks/react-query/clients/unsubscribe';
import { UnsubscribeContent } from '../UnsubscribeContent';

function UnsubscribeClientForm() {
  const searchParams = useSearchParams();
  const { mutate, isPending, isError, isSuccess } = useUnsubscribeClient();

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

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <UnsubscribeClientForm />
    </Suspense>
  );
}

