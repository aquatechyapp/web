'use client';

import Image from 'next/image';

import imageIcon from '/public/images/logoHor.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UnsubscribeContentProps {
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  onUnsubscribe: () => void;
}

export function UnsubscribeContent({ isPending, isError, isSuccess, onUnsubscribe }: UnsubscribeContentProps) {
  return (
    <div className="inline-flex w-96 flex-col items-start justify-start gap-[18px] rounded-lg bg-gray-50 px-6 py-8 md:w-[680px]">
      <div className="mb-8 inline-flex h-5 items-center justify-center gap-3 self-stretch">
        <Image priority width="0" height="0" sizes="100vw" className="h-auto w-80" src={imageIcon} alt="Logo" />
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold leading-[30px] text-gray-900 text-center">
            Unsubscribe from Emails
          </CardTitle>
          <CardDescription className="text-center">
            {isSuccess
              ? 'You have been successfully unsubscribed.'
              : 'We are sorry to see you go. Click the button below to unsubscribe from our emails.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          {isError && (
            <div className="w-full text-center text-sm text-red-600">
              Internal error, please contact us at{' '}
              <span className="font-semibold text-blue-500">contact@aquatechy.com</span>
            </div>
          )}

          {isPending && (
            <div
              className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            />
          )}

          {!isSuccess && !isPending && (
            <Button onClick={onUnsubscribe} className="w-full" variant="destructive">
              Unsubscribe
            </Button>
          )}

          {isSuccess && (
            <div className="w-full space-y-4">
              <p className="text-center text-sm text-gray-600">
                You will no longer receive any email from us. If you change your mind, please contact us at{' '}
                <span className="font-semibold text-blue-500">contact@aquatechy.com</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

