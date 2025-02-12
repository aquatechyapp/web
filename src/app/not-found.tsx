'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Compass } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-white to-blue-50">
      <div className="border-b bg-white px-4 py-2 shadow-sm">
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
        <div className="relative">
          <Compass className="mx-auto h-32 w-32 text-blue-400 opacity-80" />
          <div className="absolute -right-3 -top-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 p-1.5">
              <div className="h-5 w-5 rounded-full border-2 border-dashed border-blue-400"></div>
            </div>
          </div>
        </div>
        <h1 className="mt-8 text-4xl font-bold text-zinc-800">Page Not Found</h1>
        <p className="mb-6 mt-3 text-center text-lg text-zinc-600">
          Looks like you've sailed into uncharted waters!
          <br />
          This page doesn't exist.
        </p>
        <Button asChild variant="default" className="bg-blue-500 hover:bg-blue-600">
          <Link href={'/dashboard'} replace>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Aquatechy
          </Link>
        </Button>
      </div>
    </div>
  );
}
