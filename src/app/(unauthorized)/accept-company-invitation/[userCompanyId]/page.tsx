'use client';

import { notFound, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAcceptCompanyInvitation } from '@/hooks/react-query/companies/acceptCompanyInvitation';

function isValidObjectId(id: string): boolean {
  const objectIdRegex = /^[a-fA-F0-9]{24}$/;
  return objectIdRegex.test(id);
}

type Props = {
  params: { userCompanyId: string };
};

export default function AcceptCompanyInvitationPage({ params: { userCompanyId } }: Props) {
  if (!userCompanyId || !isValidObjectId(userCompanyId)) {
    notFound();
  }

  const router = useRouter();
  const { mutate, isPending } = useAcceptCompanyInvitation();
  const hasRequested = useRef(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    mutate(
      { userCompanyId, status: 'Active' },
      {
        onSuccess: () => {
          router.push('/login');
        },
        onError: () => {
          setShowError(true);
        }
      }
    );
  }, [mutate, router, userCompanyId]);

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
            <span className="font-semibold text-primary">contact@aquatechy.com</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
