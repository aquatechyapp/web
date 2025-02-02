'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, BotIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function ServerOfflinePage() {
  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="border-b px-4 py-2">
        <Image
          width="0"
          height="0"
          sizes="100vw"
          className="h-auto w-52"
          src="/images/logoHor.png"
          alt="Aquatechy Logo"
          priority
        />
      </div>
      <div className="flex h-full flex-col items-center justify-center p-4 pb-40">
        <BotIcon className="mx-auto h-24 w-24 text-zinc-300" />
        <h1 className="text-3xl font-bold text-zinc-800">Server is offline</h1>
        <p className="mb-4 mt-1 text-lg text-zinc-500">
          We are currently experiencing technical difficulties. Please try again later.
        </p>
        <Button asChild variant="default">
          <Link href={'/'} replace>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to aplication
          </Link>
        </Button>
      </div>
    </div>
  );
}
