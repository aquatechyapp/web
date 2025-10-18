'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkOrdersPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the schedule page as the default
    router.replace('/work-orders/schedule');
  }, [router]);

  return null;
}
