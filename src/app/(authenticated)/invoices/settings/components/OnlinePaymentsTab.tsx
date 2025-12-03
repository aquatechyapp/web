'use client';

import { CreditCard } from 'lucide-react';

export function OnlinePaymentsTab() {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CreditCard className="mb-4 h-12 w-12 text-gray-400" />
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Online Payments</h2>
        <p className="max-w-md text-sm text-gray-600">
          We're working on integrating Stripe for online payments. This feature will be available soon, allowing your clients to pay invoices directly online.
        </p>
      </div>
    </div>
  );
}

