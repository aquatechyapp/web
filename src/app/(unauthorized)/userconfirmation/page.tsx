'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { clientAxios } from '@/lib/clientAxios';

import { useToast } from '../../../components/ui/use-toast';

function UserConfirmationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async () => await clientAxios.post(`/userconfirmation/${token}`),
    onSuccess: () => {
      router.push('/login');
      toast({
        title: 'Success',
        description: 'User account confirmed successfully.',
        duration: 8000,
        variant: 'success'
      });
    },
    onError: () => {
      toast({
        variant: 'error',
        title: 'Internal error',
        description: 'Please try again later.',
        duration: 8000
      });
    }
  });

  useEffect(() => mutate(), [mutate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirming E-mail</CardTitle>
        <CardDescription>You'll be redirect soon</CardDescription>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="mt-4">
            {isError && (
              <div>
                Internal error, please contact us{' '}
                <span className="font-bold text-blue-500"> contact@aquatechy.com</span>
              </div>
            )}
            {isPending && (
              <div
                className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              />
            )}
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <UserConfirmationForm />
    </Suspense>
  );
}
