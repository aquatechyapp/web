import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';

export function withProfileCheck(WrappedComponent: React.ComponentType) {
  return function WithProfileCheck(props: any) {
    const router = useRouter();
    const user = useUserStore((state) => state.user);

    useEffect(() => {
      // Get current path
      const currentPath = window.location.pathname;

      // Skip check for quickstart and dashboard
      if (currentPath === '/quickstart' || currentPath === '/dashboard') {
        return;
      }

      // Check if profile is incomplete
      if (user.firstName === '') {
        router.push('/account');
      }
    }, [user.firstName, router]);

    return <WrappedComponent {...props} />;
  };
}
