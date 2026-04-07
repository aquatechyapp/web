'use client';

import { notFound, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAcceptInvitationByToken } from '@/hooks/react-query/companies/acceptInvitationByToken';

type Props = {
  params: { userCompanyId: string };
};

export default function AcceptCompanyInvitationPage({ params: { userCompanyId } }: Props) {
  const invitationTokenId = userCompanyId?.trim();
  if (!invitationTokenId) {
    notFound();
  }

  const router = useRouter();
  const { mutate, isPending } = useAcceptInvitationByToken();
  const hasRequested = useRef(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    mutate(
      { invitationTokenId, status: 'Active' },
      {
        onSuccess: () => {
          router.push('/login');
        },
        onError: () => {
          setShowError(true);
        }
      }
    );
  }, [mutate, router, invitationTokenId]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Accepting invitation</CardTitle>
        <CardDescription>Please wait while we confirm your company membership.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {isPending && (
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
            aria-label="Loading"
          />
        )}
        {showError && !isPending && (
          <p className="text-center text-sm text-muted-foreground">
            Something went wrong. Please try again or contact{' '}
            <span className="font-semibold text-primary">contact@aquatechyapp.com</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
