'use client';

import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { Colors } from '@/constants/colors';
import { clientAxios } from '@/lib/clientAxios';
import { useUserStore } from '@/store/user';
import { UserSubscription } from '@/ts/enums/enums';

import { SubscriptionCard } from './SubscriptionCard';

interface Props {
  searchParams: {
    status: string;
    session_id: string;
  };
}

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

export default function Page({ searchParams }: Props) {
  const { status, session_id } = searchParams;
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

  useEffect(() => {
    if (status === 'pending') {
      const checkPaymentStatus = async () => await clientAxios.get(`/subscriptions/checkpayment/${session_id}`);
      setTimeout(() => {
        checkPaymentStatus()
          .then((res) => {
            if (res.data.paymentStatus === 'unpaid') {
              push('/account/subscription?status=cancelled');
              toast({
                title: 'Failed to process payment',
                className: 'bg-red-500 text-white'
              });
              return res;
            }
            if (res.data.paymentStatus === 'paid') {
              setUser({ ...user, subscription: res.data.subscription });
              push('/account/subscription');
              toast({
                title: 'Payment processed successfully',
                description: 'You can now enjoy your new subscription',
                className: 'bg-green-500 text-white'
              });
              return res;
            }
          })
          .catch((err) => {
            push('/account/subscription?status=cancelled');
            return err;
          });
      }, 5000);
    }
  }, []);

  return (
    <div className="flex w-full flex-col items-center">
      {alertData && (
        <Alert className={`${alertData.customClassName} w-fit min-w-72`} variant={alertData.variant}>
          <alertData.CustomAlertIcon className={alertData.iconClassName} color={alertData.iconColor} />
          <AlertTitle>{alertData.title}</AlertTitle>
          <AlertDescription>{alertData.description}</AlertDescription>
        </Alert>
      )}
      <div className="grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-2">
        {Plans.map((p) => (
          <SubscriptionCard key={p.title} plan={p} currentPlan={user.subscription} />
        ))}
      </div>
    </div>
  );
}

const Plans = [
  {
    title: 'Starter',
    name: UserSubscription.FREE,
    price: 0,
    description: 'Only owner as user',
    features: [
      { text: 'Unlimited clients', include: true },
      { text: 'Full access to mobile app', include: true },
      { text: 'Basic reports', include: true },
      { text: 'Basic support', include: true },
      { text: 'Create up to 10 pools', include: true },
      { text: 'Email clients after service', include: false },
      { text: 'Optimized routes', include: false }
    ]
  },
  {
    title: 'Grow',
    name: UserSubscription.GROW,
    price: 39,
    description: 'Assign services up to 5 users',
    features: [
      { text: 'Unlimited clients', include: true },
      { text: 'Full access to mobile app', include: true },
      { text: 'Basic reports', include: true },
      { text: 'Specialized support', include: true },
      { text: 'Create up to 100 pools', include: true },
      { text: 'Additional pools per $0.34/month', include: true },
      { text: 'Email clients after service', include: true },
      { text: 'Optimized routes', include: true }
    ]
  }
  // {
  //   title: 'Pro',
  //   name: UserSubscription.PRO,
  //   price: 49,
  //   description: 'Assign services up to 50 users',
  //   features: [
  //     { text: 'Unlimited clients', include: true },
  //     { text: 'Full access to mobile app', include: true },
  //     { text: 'Advanced reports', include: true },
  //     { text: 'Advanced support', include: true },
  //     { text: 'Create up to 100 pools', include: true },
  //     { text: 'Additional pools per $0.39/month', include: true },
  //     { text: 'Email clients after service', include: true },
  //     { text: 'Optimized routes', include: true }
  //   ]
  // }
];
