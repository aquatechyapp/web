'use client';

import { Button } from '@/components/ui/button';
import { Globe2, Lock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function GeoBlockedPage() {
  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-white to-red-50">
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
          <Globe2 className="mx-auto h-32 w-32 text-red-400 opacity-80" />
          <div className="absolute -right-3 -top-3">
            <Lock className="h-8 w-8 rounded-full bg-red-100 p-1.5 text-red-600" />
          </div>
        </div>
        <h1 className="mt-8 text-4xl font-bold text-zinc-800">Access Restricted</h1>
        <p className="mb-6 mt-3 text-center text-lg text-zinc-600">
          We're sorry, but our services are currently only available to users in the United States.
          <br />
          <span className="text-sm text-zinc-500">
            If you believe this is an error, please contact support.
          </span>
        </p>
      </div>
    </div>
  );
}
