'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { clientAxios } from '@/lib/clientAxios';

import { useToast } from '../../../components/ui/use-toast';

interface PropsToken {
  searchParams: {
    token: string;
  };
}

export default function Page({ searchParams }: PropsToken) {
  const router = useRouter();
  const token = searchParams.token;
  const { toast } = useToast();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async () => await clientAxios.post(`/userconfirmation/${token}`),
    onSuccess: () => {
      router.push('/login');
      toast({
        title: 'Success',
        description: 'User account confirmed successfully.',
        variant: 'success'
      });
    },
    onError: () => {
      toast({
        variant: 'error',
        title: 'Internal error',
        description: 'Please try again later.'
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
