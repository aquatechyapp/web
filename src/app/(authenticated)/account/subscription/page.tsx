'use client';

import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { Colors } from '@/constants/colors';
import { clientAxios } from '@/lib/clientAxios';
import { useUserStore } from '@/store/user';
import { UserSubscription } from '@/ts/enums/enums';

import { SubscriptionCard } from './SubscriptionCard';

type AlertKey = 'success' | 'cancelled' | 'pending';

const alertType: Record<
  AlertKey,
  {
    variant: 'destructive' | 'default' | null | undefined;
    title: string;
    description?: string;
    CustomAlertIcon: React.FC<React.SVGProps<SVGSVGElement>>;
    customClassName?: string;
    iconClassName?: string;
    iconColor?: string;
  }
> = {
  success: {
    title: 'Payment Approved',
    variant: undefined,
    description: 'Congratulations! Your payment has been approved',
    CustomAlertIcon: Check,
    customClassName: 'text-green-500 border-green-500',
    iconColor: '#22c55e',
    iconClassName: ''
  },
  pending: {
    title: 'Payment processing',
    variant: undefined,
    description: 'We are processing your payment',
    CustomAlertIcon: Loader2,
    customClassName: 'text-blue-500 border-blue-500',
    iconClassName: 'animate-spin',
    iconColor: Colors.blue[500]
  },
  cancelled: {
    title: 'Error',
    description: 'Failed to process your payment',
    variant: 'destructive',
    CustomAlertIcon: AlertCircle
  }
};

export default function Page() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const session_id = searchParams.get('session_id');
  const { push } = useRouter();
  const { setUser, user } = useUserStore(
    useShallow((state) => ({
      setUser: state.setUser,
      user: state.user
    }))
  );

  let alertData;

  if (status === 'success' || status === 'cancelled' || status === 'pending') {
    alertData = alertType[status as AlertKey];
  }

  // Payment status check effect
  useEffect(() => {
    if (status === 'pending' && session_id) {
      const checkPaymentStatus = async () => {
        try {
          const response = await clientAxios.get(`/subscriptions/checkpayment/${session_id}`);
          
          if (response.data.paymentStatus === 'unpaid') {
            push('/account/subscription?status=cancelled');
            toast({
              title: 'Failed to process payment',
              variant: 'error'
            });
            return;
          }
          
          if (response.data.paymentStatus === 'paid') {
            setUser({ ...user, subscription: response.data.subscription });
            push('/account/subscription?status=success');
            toast({
              title: 'Payment processed successfully',
              description: 'You can now enjoy your new subscription',
              variant: 'success'
            });
          }
        } catch (err) {
          push('/account/subscription?status=cancelled');
        }
      };

      // Execute immediately and then set interval
      checkPaymentStatus();
      const interval = setInterval(checkPaymentStatus, 5000);

      // Cleanup interval
      return () => clearInterval(interval);
    }
  }, [status, session_id, setUser, user]);

  // Separate profile check effect
  useEffect(() => {
    if (user.firstName === '') {
      push('/account');
    }
  }, [user, push]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900">Choose Your Perfect Plan</h1>
          <p className="text-lg text-gray-600">
            Get started with our flexible plans designed to help your pool service business grow
          </p>
        </div>

        {/* Alert Section */}
        {alertData && (
          <div className="mb-8">
            <Alert className={`${alertData.customClassName} mx-auto w-fit min-w-96`} variant={alertData.variant}>
              <alertData.CustomAlertIcon className={alertData.iconClassName} color={alertData.iconColor} />
              <AlertTitle>{alertData.title}</AlertTitle>
              <AlertDescription>{alertData.description}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {Plans.map((p) => (
            <div key={p.title} className="transform transition-all duration-300 hover:scale-105">
              <SubscriptionCard plan={p} currentUserPlan={user.subscription} />
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-8 text-center text-2xl font-semibold text-gray-900">Compare Plan Features</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="pb-4 text-left text-gray-600">Feature</th>
                  <th className="pb-4 text-center text-gray-600">Starter</th>
                  <th className="pb-4 text-center text-gray-600">Grow</th>
                </tr>
              </thead>
              <tbody>
                
                <tr className="border-b">
                  <td className="py-4 text-gray-900">Pools Limit</td>
                  <td className="text-center text-gray-700">30 pools</td>
                  <td className="text-center text-gray-700">300 pools (extra pools cost $0.23 each)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 text-gray-900">Support Level</td>
                  <td className="text-center text-gray-700">Basic</td>
                  <td className="text-center text-gray-700">Specialized</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 text-gray-900">Route Optimization</td>
                  <td className="text-center text-gray-700">✓</td>
                  <td className="text-center text-gray-700">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 text-gray-900">Mobile App Access</td>
                  <td className="text-center text-gray-700">✓</td>
                  <td className="text-center text-gray-700">✓</td>
                </tr>
                <tr>
                  <td className="py-4 text-gray-900">Email Features</td>
                  <td className="text-center text-gray-700">Basic</td>
                  <td className="text-center text-gray-700">Advanced</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-semibold text-gray-900">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 font-semibold text-gray-900">What happens if I exceed my pool limit?</h3>
              <p className="text-gray-600">With the Grow plan, additional pools cost just $0.23 each. You can add pools as your business grows.</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 font-semibold text-gray-900">Can I change plans later?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Plans = [
  {
    title: 'Starter',
    name: UserSubscription.FREE,
    price: 0,
    features: [
      { text: '30 clients', include: true },
      { text: 'Full access to mobile app', include: true },
      { text: 'Basic reports', include: true },
      { text: 'Basic support', include: true },
      { text: 'Create up to 30 pools', include: true },
      { text: 'Optimize routes', include: true },
      { text: 'Email clients after service', include: false },
      { text: 'Broadcast e-mails', include: false }
    ]
  },
  {
    title: 'Grow',
    name: UserSubscription.GROW,
    price: 69,
    features: [
      { text: 'Unlimited clients', include: true },
      { text: 'Full access to mobile app', include: true },
      { text: 'Basic reports', include: true },
      { text: 'Specialized support', include: true },
      { text: 'Create up to 300 pools', include: true },
      { text: 'Optimize routes', include: true },
      { text: 'Email clients after service', include: true },
      { text: 'Broadcast e-mails', include: true }
    ],
    extra: '* Extra pools costs $0.23 each'
  }
];
