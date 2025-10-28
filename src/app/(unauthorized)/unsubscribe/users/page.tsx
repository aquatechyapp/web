'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useUnsubscribeUser } from '@/hooks/react-query/user/unsubscribe';
import { UnsubscribeContent } from '../UnsubscribeContent';

function UnsubscribeUserForm() {
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

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <UnsubscribeUserForm />
    </Suspense>
  );
}

