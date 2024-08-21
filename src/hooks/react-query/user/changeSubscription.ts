import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useToast } from '@/components/ui/use-toast';
import { UserSubscription } from '@/constants/enums';
import { useUserStore } from '@/store/user';

import { clientAxios } from '../../../lib/clientAxios';

export const useChangeSubscription = (subscriptionPlan: UserSubscription) => {
  const user = useUserStore((state) => state.user);
  const { toast } = useToast();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () =>
      await clientAxios.post('/subscriptions', {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        subscriptionPlan
      }),
    onSuccess: async ({ data }) => {
      window.open(data, '_blank', 'noreferrer');
    },
    onError: (error): Error | AxiosError => {
      toast({
        title: 'Error on request to change subscription',
        description: 'Please try again later or contact support',
        className: 'bg-red-500 text-white'
      });
      return error;
    }
  });
  return { mutate, isPending, error };
};
