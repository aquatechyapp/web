'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { clientAxios } from '@/lib/clientAxios';

import { useToast } from '../../../components/ui/use-toast';

interface PropsToken {
  searchParams: {
    token: string;
  };
}

export default function Page({ searchParams }: PropsToken) {
  const router = useRouter();
  const [confirmationStatus, setConfirmationStatus] = useState<string | null>(null);
  const token = searchParams.token;
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      clientAxios
        .post(`/userconfirmation/${token}`)
        .then((response) => {
          const jwtToken = response.data;
          if (jwtToken) {
            Cookies.set('accessToken', jwtToken);
            setConfirmationStatus('aprovado');
            toast({
              variant: 'default',
              title: 'Success',
              description: 'User account confirmed successfully.',
              className: 'bg-green-500 text-gray-50'
            });
          } else {
            setConfirmationStatus('não aprovado');
            toast({
              variant: 'default',
              title: 'Internal error',
              description: 'Please try again later.',
              className: 'bg-red-500 text-gray-50'
            });
          }
        })
        .catch((error) => {
          console.error('Erro na confirmação de email:', error);
          setConfirmationStatus('não aprovado');
        });
    }
  }, [token, toast]);

  useEffect(() => {
    if (confirmationStatus === 'aprovado') {
      router.push('/login');
    }
  }, [confirmationStatus, router]);

  if (confirmationStatus === null) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {confirmationStatus === 'aprovado' ? (
        <p className="text-xl font-semibold text-white">Redirecionando...</p>
      ) : (
        <p className="font-semibold text-white">Email não aprovado. Verifique o link de confirmação.</p>
      )}
    </div>
  );
}
