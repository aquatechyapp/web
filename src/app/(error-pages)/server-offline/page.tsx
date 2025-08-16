'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function ServerOfflinePage() {
  const router = useRouter();

  const handleRetry = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Logo */}
      <div className="border-b bg-white px-4 py-3 shadow-sm flex justify-center">
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

      {/* Main Content */}
      <div className="flex h-full flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <WifiOff className="w-10 h-10 text-red-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Server Currently Offline
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We're experiencing technical difficulties. Our team is working to restore service as quickly as possible.
            </p>

            {/* Status */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-yellow-800">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="font-medium">Estimated restoration: Few minutes</span>
              </div>
            </div>

            

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={handleRetry}
                className="w-full bg-[#364D9D] hover:bg-[#2a3a7a] text-white py-3"
              >
                <Wifi className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              
            </div>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                If the problem persists <br /> please contact our support team:
              </p>
              <p className="text-sm text-[#364D9D] font-medium">
                contact@aquatechyapp.com
              </p>
            </div>
          </div>

          {/* Additional Info */}
          
        </div>
      </div>
    </div>
  );
}